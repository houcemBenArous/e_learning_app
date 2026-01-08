import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import './CourseCard.css';

function CourseCard({ course }) {
  const {
    _id,
    title,
    description,
    instructor,
    averageRating = 0,
    totalReviews = 0,
  } = course;

  return (
    <div className="course-card">
      <div className="course-card-image">
        <span className="course-icon">📚</span>
      </div>
      
      <div className="course-card-content">
        <h3 className="course-title">
          <Link to={`/courses/${_id}`}>{title}</Link>
        </h3>
        
        <p className="course-description">
          {description?.length > 100 
            ? `${description.substring(0, 100)}...` 
            : description || 'No description available'}
        </p>
        
        <div className="course-instructor">
          <span className="instructor-label">Instructor:</span>
          <span className="instructor-name">{instructor?.name || 'Unknown'}</span>
          {instructor?.instructorRating > 0 && (
            <span className="instructor-rating">
              ⭐ {instructor.instructorRating.toFixed(1)}
            </span>
          )}
        </div>
        
        <div className="course-footer">
          <StarRating 
            rating={averageRating} 
            totalReviews={totalReviews}
            size="small"
          />
          
          <Link to={`/courses/${_id}`} className="btn btn-small btn-primary">
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;