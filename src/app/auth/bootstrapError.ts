export const bootstrapErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim()) return error.message;
  return 'Microsoft sign-in could not be initialized.';
};

export const authRedirectFailure = async (
  redirect: () => Promise<unknown>,
): Promise<string | null> => {
  try {
    await redirect();
    return null;
  } catch (error) {
    return bootstrapErrorMessage(error);
  }
};

export interface BootstrapAccount {
  homeAccountId: string;
}

export interface BootstrapAuthClient<Account extends BootstrapAccount = BootstrapAccount> {
  initialize(): Promise<void>;
  handleRedirectPromise(): Promise<{ account?: Account | null } | null>;
  getActiveAccount(): Account | null;
  getAllAccounts(): Account[];
  setActiveAccount(account: Account | null): void;
}

export const prepareAuthClient = async <Account extends BootstrapAccount>(
  client: BootstrapAuthClient<Account>,
): Promise<Account | null> => {
  await client.initialize();
  const redirect = await client.handleRedirectPromise();
  if (redirect?.account) {
    client.setActiveAccount(redirect.account);
    return redirect.account;
  }
  const active = client.getActiveAccount();
  if (active) return active;
  const cached = client.getAllAccounts();
  if (cached.length === 1) {
    client.setActiveAccount(cached[0]);
    return cached[0];
  }
  if (cached.length > 1) {
    throw new Error('Multiple cached Microsoft accounts were found. Clear sign-in and choose the account you want to use.');
  }
  return null;
};
