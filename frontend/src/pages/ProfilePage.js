// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Cropper from "react-easy-crop";
// import { getCroppedImg } from "../utils/getCroppedImg"; // ✅ utility function
// import "./ProfilePage.css";

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [formData, setFormData] = useState({
//     dateOfBirth: "",
//     phone: "",
//     department: "",
//     employeeId: "",
//     JobProfile: "",
//   });
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [isCropping, setIsCropping] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [passwordData, setPasswordData] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [passwordMsg, setPasswordMsg] = useState("");
//   const [showPasswordForm, setShowPasswordForm] = useState(false);
//   const [showAvatarModal, setShowAvatarModal] = useState(false);

//   const token = localStorage.getItem("token");

//   // Fetch profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//         setFormData({
//           dateOfBirth: res.data.dateOfBirth
//             ? new Date(res.data.dateOfBirth).toISOString().split("T")[0]
//             : "",
//           department: res.data.department || "",
//           employeeId: res.data.employeeId || "",
//           JobProfile: res.data.JobProfile || "",
//         });
//         setProfilePicture(res.data.profilePicture || "/avatars/default.png");
//       } catch (err) {
//         setError(err.response?.data?.msg || "Failed to fetch profile");
//       }
//     };
//     if (token) fetchProfile();
//   }, [token]);

//   // Handle profile update
//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.put(`${API_BASE_URL}/api/profile`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(res.data.user);
//       setSuccess(res.data.msg);
//       setIsEditing(false);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to update profile");
//     }
//   };

//   // Crop complete
//   const onCropComplete = useCallback((_, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   // Handle crop + upload
//   const handleCropAndUpload = async () => {
//     try {
//       const croppedBlob = await getCroppedImg(
//         URL.createObjectURL(profilePicture),
//         croppedAreaPixels
//       );

//       const data = new FormData();
//       data.append("profilePicture", croppedBlob);

//       const res = await axios.post(
//         `${API_BASE_URL}/api/profile/picture`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setUser({ ...user, profilePicture: res.data.profilePicture });
//       setSuccess(res.data.msg);
//       setIsCropping(false);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to upload profile picture");
//     }
//   };

//   // Handle password change
//   const handlePasswordChange = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `${API_BASE_URL}/api/auth/change-password`,
//         passwordData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPasswordMsg(res.data.msg);
//       setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
//       setShowPasswordForm(false);
//     } catch (err) {
//       setPasswordMsg(err.response?.data?.msg || "Failed to change password");
//     }
//   };

//   // Handle Avatar Select
//   const handleAvatarSelect = async (avatar) => {
//     try {
//       const res = await axios.put(
//         `${API_BASE_URL}/api/profile/avatar`,
//         { avatar },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setUser({ ...user, profilePicture: avatar }); // ✅ use avatar directly from /public/avatars
//       setSuccess(res.data.msg);
//       setShowAvatarModal(false);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to update avatar");
//     }
//   };

//   // ✅ Helper: build correct image URL
//   const getImageUrl = (pic) => {
//     if (!pic) return "/avatars/default.png";
//     if (pic.startsWith("/avatars/")) return pic; // public avatars
//     if (pic.startsWith("http")) return pic; // absolute backend URL
//     return `${API_BASE_URL}${pic}`; // uploaded files from backend
//   };

//   if (!token) return <div>Please log in to view your profile.</div>;
//   if (!user) return <div>Loading...</div>;

//   return (
//     <div className="profilepage-wrapper">
//       <div className="profilepage-header">
//         <h1>My Profile</h1>
//         <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
//           {isEditing ? "Cancel" : "Edit"}
//         </button>
//       </div>

//       {success && <p className="success">{success}</p>}
//       {error && <p className="error">{error}</p>}

//       <div className="profilepage-content">
//         {/* Profile Picture */}
//         <div className="profile-picture">
//           <img
//             src={getImageUrl(user.profilePicture)}
//             alt="Profile"
//             className="profile-img"
//           />

//           {isEditing && (
//             <div className="photo-actions">
//               <label className="photo-btn">
//                 Change Photo
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     setProfilePicture(e.target.files[0]);
//                     setIsCropping(true);
//                   }}
//                   hidden
//                 />
//               </label>
//               {/* <button
//                 className="photo-btn"
//                 onClick={() => {
//                   setProfilePicture(null);
//                   setUser({ ...user, profilePicture: "/avatars/default.png" });
//                 }}
//               >
//                 Remove Photo
//               </button> */}
//               <button
//                 className="photo-btn"
//                 onClick={() => setShowAvatarModal(true)}
//               >
//                 Choose Avatar
//               </button>
//             </div>
//           )}

//           {isCropping && (
//             <>
//               <div className="crop-container">
//                 <Cropper
//                   image={profilePicture ? URL.createObjectURL(profilePicture) : ""}
//                   crop={crop}
//                   zoom={zoom}
//                   aspect={1}
//                   onCropChange={setCrop}
//                   onZoomChange={setZoom}
//                   onCropComplete={onCropComplete}
//                 />
//               </div>
//               <div className="crop-actions">
//                 <button className="save-btn" onClick={handleCropAndUpload}>
//                   Save Crop
//                 </button>
//                 <button
//                   className="cancel-btn"
//                   onClick={() => setIsCropping(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="profile-info">
//           {isEditing ? (
//             <form onSubmit={handleUpdateProfile}>
//               <div className="field"><label>Name:</label><span>{user.name}</span></div>
//               <div className="field"><label>Email:</label><span>{user.email}</span></div>
//               <div className="field">
//                 <label>Date of Birth:</label>
//                 <input
//                   type="date"
//                   name="dateOfBirth"
//                   value={formData.dateOfBirth}
//                   onChange={(e) =>
//                     setFormData({ ...formData, dateOfBirth: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="field">
//                 <label>Department:</label>
//                 {/* <input */}
//                   type="text"
//                   name="department"
//                   value={formData.department}
//                   onChange={(e) =>
//                     setFormData({ ...formData, department: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="field">
//                 <label>Job Role:</label>
//                 <input
//                   type="text"
//                   name="JobProfile"
//                   value={formData.JobProfile}
//                   onChange={(e) =>
//                     setFormData({ ...formData, JobProfile: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="field">
//                 <label>Employee ID:</label>
//                 <input
//                   type="text"
//                   name="employeeId"
//                   value={formData.employeeId}
//                   onChange={(e) =>
//                     setFormData({ ...formData, employeeId: e.target.value })
//                   }
//                 />
//               </div>
//               <button type="submit" className="save-btn">Save Changes</button>
//             </form>
//           ) : (
//             <>
//               <div className="field"><label>Name:</label><span>{user.name}</span></div>
//               <div className="field"><label>Email:</label><span>{user.email}</span></div>
//               <div className="field"><label>Date of Birth:</label><span>{formData.dateOfBirth || "Not set"}</span></div>
//               <div className="field"><label>Department:</label><span>{formData.department || "Not set"}</span></div>
//               <div className="field"><label>Job Role:</label><span>{formData.JobProfile || "Not set"}</span></div>
//               <div className="field"><label>Employee ID:</label><span>{formData.employeeId || "Not set"}</span></div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Change Password */}
//       <div className="change-password">
//         <button
//           className="toggle-btn"
//           onClick={() => setShowPasswordForm(!showPasswordForm)}
//         >
//           {showPasswordForm ? "Cancel Change Password" : "Change Password"}
//         </button>
//         {showPasswordForm && (
//           <form onSubmit={handlePasswordChange} className="password-form">
//             <input
//               type="password"
//               placeholder="Old Password"
//               value={passwordData.oldPassword}
//               onChange={(e) =>
//                 setPasswordData({ ...passwordData, oldPassword: e.target.value })
//               }
//               required
//             />
//             <input
//               type="password"
//               placeholder="New Password"
//               value={passwordData.newPassword}
//               onChange={(e) =>
//                 setPasswordData({ ...passwordData, newPassword: e.target.value })
//               }
//               required
//             />
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               value={passwordData.confirmPassword}
//               onChange={(e) =>
//                 setPasswordData({ ...passwordData, confirmPassword: e.target.value })
//               }
//               required
//             />
//             <button type="submit" className="save-btn">Update Password</button>
//           </form>
//         )}
//         {passwordMsg && <p className="info">{passwordMsg}</p>}
//       </div>

//       {/* Avatar Modal */}
//       {showAvatarModal && (
//         <div className="avatar-modal">
//           <div className="avatar-box">
//             <h3>Choose an Avatar</h3>
//             <div className="avatar-grid">
//               {[
//                 "/avatars/avatar1.png",
//                 "/avatars/avatar2.png",
//                 "/avatars/avatar3.png",
//                 "/avatars/avatar4.png",
//                 "/avatars/avatar5.png",
//                 "/avatars/avatar6.png",
//                 "/avatars/avatar7.png",
//                 "/avatars/avatar8.png",
//               ].map((a, idx) => (
//                 <img
//                   key={idx}
//                   src={a}
//                   alt="avatar"
//                   className="avatar-option"
//                   onClick={() => handleAvatarSelect(a)}
//                 />
//               ))}
//             </div>
//             <button className="cancel-btn" onClick={() => setShowAvatarModal(false)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/getCroppedImg"; // ✅ utility function

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const token = localStorage.getItem("token");

  // Responsive resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/profile`, {
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
      const res = await axios.put(`${API_BASE_URL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setSuccess(res.data.msg);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update profile");
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropAndUpload = async () => {
    try {
      const croppedBlob = await getCroppedImg(
        URL.createObjectURL(profilePicture),
        croppedAreaPixels
      );

      const data = new FormData();
      data.append("profilePicture", croppedBlob);

      const res = await axios.post(`${API_BASE_URL}/api/profile/picture`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser({ ...user, profilePicture: res.data.profilePicture });
      setSuccess(res.data.msg);
      setIsCropping(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to upload profile picture");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/change-password`,
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

  const handleAvatarSelect = async (avatar) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/profile/avatar`,
        { avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, profilePicture: avatar });
      setSuccess(res.data.msg);
      setShowAvatarModal(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update avatar");
    }
  };

  const getImageUrl = (pic) => {
    if (!pic) return "/avatars/default.png";
    if (pic.startsWith("/avatars/")) return pic;
    if (pic.startsWith("http")) return pic;
    return `${API_BASE_URL}${pic}`;
  };

  if (!token) return <div>Please log in to view your profile.</div>;
  if (!user) return <div>Loading...</div>;

  // Inline styles
  const wrapperStyle = {
    minHeight: "100vh",
    width: "100%",
    background: "#f5f7fa",
    padding: windowWidth < 600 ? "1.5rem" : "4rem",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: "border-box",
  };

  const headerStyle = {
    display: "flex",
    flexDirection: windowWidth < 500 ? "column" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  };

  const headerTitleStyle = {
    fontSize: windowWidth < 500 ? "2rem" : "3rem",
    fontWeight: 700,
    color: "#1e3a8a",
    marginBottom: windowWidth < 500 ? "1rem" : 0,
  };

  const editBtnStyle = {
    background: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1.2rem",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: windowWidth < 900 ? "column" : "row",
    gap: "2rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  };

  const profilePictureStyle = {
    flex: 1,
    textAlign: "center",
    marginBottom: windowWidth < 900 ? "2rem" : 0,
  };

  const profileImgStyle = {
    width: windowWidth < 400 ? "180px" : "280px",
    height: windowWidth < 400 ? "180px" : "280px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "6px solid #1e3a8a",
    marginBottom: "1rem",
  };

  const photoActionsStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    alignItems: "center",
  };

  const photoBtnStyle = {
    background: "#1e3a8a",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 500,
  };

  const cropContainerStyle = {
    position: "relative",
    width: windowWidth < 400 ? "220px" : "320px",
    height: windowWidth < 400 ? "220px" : "320px",
    margin: "1.5rem auto",
    background: "#333",
    borderRadius: "10px",
    overflow: "hidden",
  };

  const cropActionsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1rem",
    flexWrap: "wrap",
  };

  const profileInfoStyle = {
    flex: 2,
    minWidth: windowWidth < 600 ? "100%" : "400px",
  };

  const fieldStyle = { marginBottom: "1rem", fontSize: "1.1rem" };
  const labelStyle = { fontWeight: 600, marginRight: "15px", color: "#1e3a8a", minWidth: "120px", display: "inline-block" };
  const inputStyle = { width: "100%", padding: "10px", fontSize: "1rem", borderRadius: "6px", border: "1px solid #bbb", boxSizing: "border-box" };
  const spanStyle = { color: "#444", fontSize: "1rem" };

  const saveBtnStyle = { backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" };
  const cancelBtnStyle = { backgroundColor: "#6c757d", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" };
  const toggleBtnStyle = { background: "#ffc107", color: "#222", padding: "10px 18px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem", marginBottom: "1rem" };
  const passwordFormStyle = { display: "flex", flexDirection: "column", gap: "1rem" };
  const passwordInputStyle = { padding: "12px", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "6px" };
  const infoStyle = { marginTop: "1rem", color: "#444", fontSize: "1rem" };
  const avatarModalStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 };
  const avatarBoxStyle = { background: "#fff", padding: "2rem", borderRadius: "10px", textAlign: "center", width: "500px", maxWidth: "95%" };
  const avatarGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "1rem", marginBottom: "1rem" };
  const avatarOptionStyle = { width: "80px", height: "80px", borderRadius: "50%", cursor: "pointer", border: "3px solid transparent", objectFit: "cover", transition: "0.3s" };

  return (
    <div style={wrapperStyle}>
      <div style={headerStyle}>
        <h1 style={headerTitleStyle}>My Profile</h1>
        <button style={editBtnStyle} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={contentStyle}>
        <div style={profilePictureStyle}>
          <img src={getImageUrl(user.profilePicture)} alt="Profile" style={profileImgStyle} />
          {isEditing && (
            <div style={photoActionsStyle}>
              <label style={photoBtnStyle}>
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => { setProfilePicture(e.target.files[0]); setIsCropping(true); }}
                  hidden
                />
              </label>
              <button style={photoBtnStyle} onClick={() => setShowAvatarModal(true)}>Choose Avatar</button>
            </div>
          )}
          {isCropping && (
            <>
              <div style={cropContainerStyle}>
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
              <div style={cropActionsStyle}>
                <button style={saveBtnStyle} onClick={handleCropAndUpload}>Save Crop</button>
                <button style={cancelBtnStyle} onClick={() => setIsCropping(false)}>Cancel</button>
              </div>
            </>
          )}
        </div>

        <div style={profileInfoStyle}>
          {isEditing ? (
            <form onSubmit={handleUpdateProfile}>
              <div style={fieldStyle}><label style={labelStyle}>Name:</label><span style={spanStyle}>{user.name}</span></div>
              <div style={fieldStyle}><label style={labelStyle}>Email:</label><span style={spanStyle}>{user.email}</span></div>
              <div style={fieldStyle}><label style={labelStyle}>Date of Birth:</label><input type="date" style={inputStyle} value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} /></div>
              <div style={fieldStyle}><label style={labelStyle}>Department:</label><input type="text" style={inputStyle} value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} /></div>
              <div style={fieldStyle}><label style={labelStyle}>Job Role:</label><input type="text" style={inputStyle} value={formData.JobProfile} onChange={(e) => setFormData({ ...formData, JobProfile: e.target.value })} /></div>
              <div style={fieldStyle}><label style={labelStyle}>Employee ID:</label><input type="text" style={inputStyle} value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} /></div>
              <button type="submit" style={saveBtnStyle}>Save Changes</button>
            </form>
          ) : (
            <>
              <div style={fieldStyle}><label style={labelStyle}>Name:</label><span style={spanStyle}>{user.name}</span></div>
              <div style={fieldStyle}><label style={labelStyle}>Email:</label><span style={spanStyle}>{user.email}</span></div>
              <div style={fieldStyle}><label style={labelStyle}>Date of Birth:</label><span style={spanStyle}>{formData.dateOfBirth || "Not set"}</span></div>
              <div style={fieldStyle}><label style={labelStyle}>Department:</label><span style={spanStyle}>{formData.department || "Not set"}</span></div>
              <div style={fieldStyle}><label style={labelStyle}>Job Role:</label><span style={spanStyle}>{formData.JobProfile || "Not set"}</span></div>
              <div style={fieldStyle}><label style={labelStyle}>Employee ID:</label><span style={spanStyle}>{formData.employeeId || "Not set"}</span></div>
            </>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #ddd" }}>
        <button style={toggleBtnStyle} onClick={() => setShowPasswordForm(!showPasswordForm)}>
          {showPasswordForm ? "Cancel Change Password" : "Change Password"}
        </button>
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} style={passwordFormStyle}>
            <input type="password" placeholder="Old Password" style={passwordInputStyle} value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} required />
            <input type="password" placeholder="New Password" style={passwordInputStyle} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
            <input type="password" placeholder="Confirm Password" style={passwordInputStyle} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
            <button type="submit" style={saveBtnStyle}>Update Password</button>
          </form>
        )}
        {passwordMsg && <p style={infoStyle}>{passwordMsg}</p>}
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div style={avatarModalStyle}>
          <div style={avatarBoxStyle}>
            <h3 style={{ marginBottom: "1rem", color: "#1e3a8a" }}>Choose an Avatar</h3>
            <div style={avatarGridStyle}>
              {["/avatars/avatar1.png","/avatars/avatar2.png","/avatars/avatar3.png","/avatars/avatar4.png","/avatars/avatar5.png","/avatars/avatar6.png","/avatars/avatar7.png","/avatars/avatar8.png"].map((a, idx) => (
                <img key={idx} src={a} alt="avatar" style={avatarOptionStyle} onClick={() => handleAvatarSelect(a)} />
              ))}
            </div>
            <button style={cancelBtnStyle} onClick={() => setShowAvatarModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
