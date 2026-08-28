import { useNavigate, useParams } from 'react-router-dom';
import KnowledgeBase, { type GuideId } from '../../KnowledgeBase';

export function KnowledgeBaseRoute() {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const onGuideChange = (next: GuideId | null) => {
    navigate(next ? `/knowledge-base/${next}` : '/knowledge-base');
  };
  return <KnowledgeBase guideId={guideId} onGuideChange={onGuideChange} />;
}
