import { useNavigate, useParams } from 'react-router-dom';
import ExamPrepHub from '../../ExamPrepHub';

export function StudyHubRoute() {
  const { examId } = useParams();
  const navigate = useNavigate();
  return (
    <ExamPrepHub
      examId={examId}
      onExamChange={next => navigate(next ? `/study-hub/${next}` : '/study-hub')}
    />
  );
}
