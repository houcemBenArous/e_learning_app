import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coursesAPI } from '../../api/courses';
import { lessonsAPI } from '../../api/lessons';
import { quizzesAPI } from '../../api/quizzes';
import { feedbackAPI } from '../../api/feedback';
import StarRating from '../../components/StarRating/StarRating';
import './CourseDetail.css';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    courseRating: 5,
    courseReview: '',
    instructorRating: 5,
    instructorReview: ''
  });

  const isEnrolled = course?.students?.some(s => s._id === user?.id);
  const isOwner = course?.instructor?._id === user?.id;

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const courseData = await coursesAPI.getById(id);
      setCourse(courseData);

      if (isAuthenticated) {
        const [lessonsData, quizzesData] = await Promise.all([
          lessonsAPI.getByCourse(id),
          quizzesAPI.getByCourse(id)
        ]);
        setLessons(lessonsData);
        setQuizzes(quizzesData);
      }

      const feedbackData = await feedbackAPI.getByCourse(id);
      setFeedbacks(feedbackData.feedbacks || []);
    } catch (err) {
      setError('Failed to load course details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await coursesAPI.enroll(id);
      await fetchCourseData();
      alert('Successfully enrolled!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await feedbackAPI.create({
        courseId: id,
        ...feedbackData
      });
      setShowFeedbackForm(false);
      await fetchCourseData();
      alert('Feedback submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  if (loading) return <div className="loading">Loading course...</div>;
  if (error) return <div className="error-page">{error}</div>;
  if (!course) return <div className="error-page">Course not found</div>;

  return (
    <div className="course-detail">
      <div className="course-header">
        <div className="course-header-content">
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
          
          <div className="course-meta">
            <div className="instructor-info">
              <span>Instructor: </span>
              <strong>{course.instructor?.name}</strong>
              {course.instructor?.instructorRating > 0 && (
                <span className="instructor-rating">
                  ⭐ {course.instructor.instructorRating.toFixed(1)}
                </span>
              )}
            </div>
            
            <StarRating 
              rating={course.averageRating || 0} 
              totalReviews={course.totalReviews || 0}
              size="large"
            />
          </div>

          <div className="course-stats">
            <span>📚 {lessons.length} Lessons</span>
            <span>📝 {quizzes.length} Quizzes</span>
            <span>👥 {course.students?.length || 0} Students</span>
          </div>

          {user?.role === 'student' && !isEnrolled && (
            <button 
              className="btn btn-primary btn-large"
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}

          {isEnrolled && (
            <span className="enrolled-badge">✓ Enrolled</span>
          )}
        </div>
      </div>

      <div className="course-content">
        {isAuthenticated && (isEnrolled || isOwner || user?.role === 'admin') && (
          <>
            <section className="content-section">
              <h2>📚 Lessons</h2>
              {lessons.length === 0 ? (
                <p className="empty-message">No lessons available yet.</p>
              ) : (
                <div className="lessons-list">
                  {lessons.map((lesson, index) => (
                    <div key={lesson._id} className="lesson-item">
                      <span className="lesson-number">{index + 1}</span>
                      <div className="lesson-info">
                        <h4>{lesson.title}</h4>
                        <p>{lesson.content?.substring(0, 100)}...</p>
                        {lesson.videoUrl && (
                          <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="video-link">
                            🎬 Watch Video
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="content-section">
              <h2>📝 Quizzes</h2>
              {quizzes.length === 0 ? (
                <p className="empty-message">No quizzes available yet.</p>
              ) : (
                <div className="quizzes-list">
                  {quizzes.map(quiz => (
                    <div key={quiz._id} className="quiz-item">
                      <h4>{quiz.title}</h4>
                      <span>{quiz.questions?.length || 0} questions</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <section className="content-section">
          <h2>⭐ Reviews</h2>
          
          {isEnrolled && user?.role === 'student' && (
            <button 
              className="btn btn-secondary"
              onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            >
              {showFeedbackForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}

          {showFeedbackForm && (
            <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label>Course Rating</label>
                <select 
                  value={feedbackData.courseRating}
                  onChange={(e) => setFeedbackData({...feedbackData, courseRating: Number(e.target.value)})}
                >
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Course Review</label>
                <textarea
                  value={feedbackData.courseReview}
                  onChange={(e) => setFeedbackData({...feedbackData, courseReview: e.target.value})}
                  placeholder="Share your experience with this course..."
                />
              </div>
              <div className="form-group">
                <label>Instructor Rating</label>
                <select
                  value={feedbackData.instructorRating}
                  onChange={(e) => setFeedbackData({...feedbackData, instructorRating: Number(e.target.value)})}
                >
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Instructor Review</label>
                <textarea
                  value={feedbackData.instructorReview}
                  onChange={(e) => setFeedbackData({...feedbackData, instructorReview: e.target.value})}
                  placeholder="Share your thoughts about the instructor..."
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          )}

          {feedbacks.length === 0 ? (
            <p className="empty-message">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="reviews-list">
              {feedbacks.map(feedback => (
                <div key={feedback._id} className="review-item">
                  <div className="review-header">
                    <strong>{feedback.student?.name}</strong>
                    <StarRating rating={feedback.courseRating} showCount={false} size="small" />
                  </div>
                  <p>{feedback.courseReview}</p>
                  <span className="review-date">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CourseDetail;