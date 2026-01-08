import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../api/courses';
import { lessonsAPI } from '../../api/lessons';
import { quizzesAPI } from '../../api/quizzes';
import './ManageCourse.css';

function ManageCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lessons');
  
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', videoUrl: '' });
  const [quizForm, setQuizForm] = useState({ title: '', questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }] });
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [courseData, lessonsData, quizzesData] = await Promise.all([
        coursesAPI.getById(id),
        lessonsAPI.getByCourse(id),
        quizzesAPI.getByCourse(id)
      ]);
      setCourse(courseData);
      setLessons(lessonsData);
      setQuizzes(quizzesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await lessonsAPI.create({ ...lessonForm, courseId: id });
      setLessonForm({ title: '', content: '', videoUrl: '' });
      setShowLessonForm(false);
      await fetchData();
      alert('Lesson added!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add lesson');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await lessonsAPI.delete(lessonId);
      await fetchData();
    } catch (err) {
      alert('Failed to delete lesson');
    }
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    try {
      await quizzesAPI.create({ ...quizForm, courseId: id });
      setQuizForm({ title: '', questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }] });
      setShowQuizForm(false);
      await fetchData();
      alert('Quiz added!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await quizzesAPI.delete(quizId);
      await fetchData();
    } catch (err) {
      alert('Failed to delete quiz');
    }
  };

  const addQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...quizForm.questions];
    if (field === 'options') {
      updated[index].options = value;
    } else {
      updated[index][field] = value;
    }
    setQuizForm({ ...quizForm, questions: updated });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!course) return <div className="error-page">Course not found</div>;

  return (
    <div className="manage-course">
      <div className="manage-header">
        <button className="btn btn-secondary" onClick={() => navigate('/instructor/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>{course.title}</h1>
        <p>{course.students?.length || 0} students enrolled</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'lessons' ? 'active' : ''}`}
          onClick={() => setActiveTab('lessons')}
        >
          📚 Lessons ({lessons.length})
        </button>
        <button 
          className={`tab ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          📝 Quizzes ({quizzes.length})
        </button>
      </div>

      {activeTab === 'lessons' && (
        <div className="tab-content">
          <button className="btn btn-primary" onClick={() => setShowLessonForm(!showLessonForm)}>
            {showLessonForm ? 'Cancel' : '+ Add Lesson'}
          </button>

          {showLessonForm && (
            <form className="add-form" onSubmit={handleAddLesson}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})}
                  rows={5}
                  required
                />
              </div>
              <div className="form-group">
                <label>Video URL (optional)</label>
                <input
                  type="url"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Lesson</button>
            </form>
          )}

          <div className="items-list">
            {lessons.map((lesson, index) => (
              <div key={lesson._id} className="item-card">
                <div className="item-number">{index + 1}</div>
                <div className="item-info">
                  <h4>{lesson.title}</h4>
                  <p>{lesson.content?.substring(0, 100)}...</p>
                </div>
                <button className="btn btn-danger btn-small" onClick={() => handleDeleteLesson(lesson._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div className="tab-content">
          <button className="btn btn-primary" onClick={() => setShowQuizForm(!showQuizForm)}>
            {showQuizForm ? 'Cancel' : '+ Add Quiz'}
          </button>

          {showQuizForm && (
            <form className="add-form" onSubmit={handleAddQuiz}>
              <div className="form-group">
                <label>Quiz Title</label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                  required
                />
              </div>
              
              {quizForm.questions.map((q, qIndex) => (
                <div key={qIndex} className="question-block">
                  <h4>Question {qIndex + 1}</h4>
                  <div className="form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Options</label>
                    {q.options.map((opt, oIndex) => (
                      <input
                        key={oIndex}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...q.options];
                          newOpts[oIndex] = e.target.value;
                          updateQuestion(qIndex, 'options', newOpts);
                        }}
                        placeholder={`Option ${oIndex + 1}`}
                        required
                      />
                    ))}
                  </div>
                  <div className="form-group">
                    <label>Correct Answer</label>
                    <input
                      type="text"
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              
              <button type="button" className="btn btn-secondary" onClick={addQuestion}>
                + Add Question
              </button>
              <button type="submit" className="btn btn-primary">Create Quiz</button>
            </form>
          )}

          <div className="items-list">
            {quizzes.map(quiz => (
              <div key={quiz._id} className="item-card">
                <div className="item-info">
                  <h4>{quiz.title}</h4>
                  <p>{quiz.questions?.length || 0} questions</p>
                </div>
                <button className="btn btn-danger btn-small" onClick={() => handleDeleteQuiz(quiz._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCourse;