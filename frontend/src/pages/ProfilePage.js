import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/getCroppedImg"; // ✅ utility function
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    phone: "",
    department: "",
    employeeId: "",
    JobProfile: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          dateOfBirth: res.data.dateOfBirth
            ? new Date(res.data.dateOfBirth).toISOString().split("T")[0]
            : "",
          department: res.data.department || "",
          employeeId: res.data.employeeId || "",
          JobProfile: res.data.JobProfile || "",
        });
        setProfilePicture(res.data.profilePicture || "/avatars/default.png");
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch profile");
      }
    };
    if (token) fetchProfile();
  }, [token]);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setSuccess(res.data.msg);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update profile");
    }
  };

  // Crop complete
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Handle crop + upload
  const handleCropAndUpload = async () => {
    try {
      const croppedBlob = await getCroppedImg(
        URL.createObjectURL(profilePicture),
        croppedAreaPixels
      );

      const data = new FormData();
      data.append("profilePicture", croppedBlob);

      const res = await axios.post(
        "http://localhost:5000/api/profile/picture",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser({ ...user, profilePicture: res.data.profilePicture });
      setSuccess(res.data.msg);
      setIsCropping(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to upload profile picture");
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/change-password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMsg(res.data.msg);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordMsg(err.response?.data?.msg || "Failed to change password");
    }
  };

  // Handle Avatar Select
  const handleAvatarSelect = async (avatar) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/profile/avatar",
        { avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, profilePicture: avatar }); // ✅ use avatar directly from /public/avatars
      setSuccess(res.data.msg);
      setShowAvatarModal(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update avatar");
    }
  };

  // ✅ Helper: build correct image URL
  const getImageUrl = (pic) => {
    if (!pic) return "/avatars/default.png";
    if (pic.startsWith("/avatars/")) return pic; // public avatars
    if (pic.startsWith("http")) return pic; // absolute backend URL
    return `http://localhost:5000${pic}`; // uploaded files from backend
  };

  if (!token) return <div>Please log in to view your profile.</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="profilepage-wrapper">
      <div className="profilepage-header">
        <h1>My Profile</h1>
        <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <div className="profilepage-content">
        {/* Profile Picture */}
        <div className="profile-picture">
          <img
            src={getImageUrl(user.profilePicture)}
            alt="Profile"
            className="profile-img"
          />

          {isEditing && (
            <div className="photo-actions">
              <label className="photo-btn">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setProfilePicture(e.target.files[0]);
                    setIsCropping(true);
                  }}
                  hidden
                />
              </label>
              {/* <button
                className="photo-btn"
                onClick={() => {
                  setProfilePicture(null);
                  setUser({ ...user, profilePicture: "/avatars/default.png" });
                }}
              >
                Remove Photo
              </button> */}
              <button
                className="photo-btn"
                onClick={() => setShowAvatarModal(true)}
              >
                Choose Avatar
              </button>
            </div>
          )}

          {isCropping && (
            <>
              <div className="crop-container">
                <Cropper
                  image={profilePicture ? URL.createObjectURL(profilePicture) : ""}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="crop-actions">
                <button className="save-btn" onClick={handleCropAndUpload}>
                  Save Crop
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setIsCropping(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="field"><label>Name:</label><span>{user.name}</span></div>
              <div className="field"><label>Email:</label><span>{user.email}</span></div>
              <div className="field">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Department:</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Job Role:</label>
                <input
                  type="text"
                  name="JobProfile"
                  value={formData.JobProfile}
                  onChange={(e) =>
                    setFormData({ ...formData, JobProfile: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Employee ID:</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          ) : (
            <>
              <div className="field"><label>Name:</label><span>{user.name}</span></div>
              <div className="field"><label>Email:</label><span>{user.email}</span></div>
              <div className="field"><label>Date of Birth:</label><span>{formData.dateOfBirth || "Not set"}</span></div>
              <div className="field"><label>Department:</label><span>{formData.department || "Not set"}</span></div>
              <div className="field"><label>Job Role:</label><span>{formData.JobProfile || "Not set"}</span></div>
              <div className="field"><label>Employee ID:</label><span>{formData.employeeId || "Not set"}</span></div>
            </>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="change-password">
        <button
          className="toggle-btn"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          {showPasswordForm ? "Cancel Change Password" : "Change Password"}
        </button>
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="password-form">
            <input
              type="password"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, oldPassword: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              required
            />
            <button type="submit" className="save-btn">Update Password</button>
          </form>
        )}
        {passwordMsg && <p className="info">{passwordMsg}</p>}
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="avatar-modal">
          <div className="avatar-box">
            <h3>Choose an Avatar</h3>
            <div className="avatar-grid">
              {[
                "/avatars/avatar1.png",
                "/avatars/avatar2.png",
                "/avatars/avatar3.png",
                "/avatars/avatar4.png",
                "/avatars/avatar5.png",
                "/avatars/avatar6.png",
                "/avatars/avatar7.png",
                "/avatars/avatar8.png",
              ].map((a, idx) => (
                <img
                  key={idx}
                  src={a}
                  alt="avatar"
                  className="avatar-option"
                  onClick={() => handleAvatarSelect(a)}
                />
              ))}
            </div>
            <button className="cancel-btn" onClick={() => setShowAvatarModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
