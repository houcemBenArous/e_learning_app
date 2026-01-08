import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../api/profile';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    avatar: '',
    skills: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileAPI.getMyProfile();
      setProfile(data);
      if (data) {
        setFormData({
          bio: data.bio || '',
          avatar: data.avatar || '',
          skills: data.skills?.join(', ') || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);
      
      await profileAPI.updateProfile({
        bio: formData.bio,
        avatar: formData.avatar,
        skills: skillsArray
      });
      
      await fetchProfile();
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Avatar" />
            ) : (
              <span className="avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="user-info">
            <h1>{user?.name}</h1>
            <p className="email">{user?.email}</p>
            <span className={`role-badge ${user?.role}`}>{user?.role}</span>
          </div>
        </div>

        {!editing ? (
          <div className="profile-content">
            <section className="profile-section">
              <h3>Bio</h3>
              <p>{profile?.bio || 'No bio added yet.'}</p>
            </section>

            <section className="profile-section">
              <h3>Skills</h3>
              {profile?.skills?.length > 0 ? (
                <div className="skills-list">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              ) : (
                <p>No skills added yet.</p>
              )}
            </section>

            <button className="btn btn-primary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                placeholder="JavaScript, React, Node.js"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;