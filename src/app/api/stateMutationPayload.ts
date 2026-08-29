export interface StateMutationRequest {
  mutationId: string;
  expectedRevision: number;
  value?: string | null;
}

export const stateMutationPayload = (
  mutationId: string,
  expectedRevision: number,
  value: string | null,
  deleting: boolean,
): StateMutationRequest => ({
  mutationId,
  expectedRevision,
  ...(deleting ? {} : { value }),
});
