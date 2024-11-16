import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { getAuth, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const UpdateUserForm = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate(); // For navigation back to detail
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    noTelepon: '',
    alamat: '',
    role: '',
  });
  const [emailReset, setEmailReset] = useState('');
  const [showResetModal, setShowResetModal] = useState(false); // Modal state for reset password

  const [password, setPassword] = useState(''); // State for new password
  const auth = getAuth(); // Initialize Firebase auth instance

  // Fetch data user from Firestore when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", id); // Create a document reference
        const userSnapshot = await getDoc(userDocRef); // Fetch the document

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setFormData({
            namaLengkap: userData.namaLengkap || '',
            email: userData.email || '',
            noTelepon: userData.noTelepon || '',
            alamat: userData.alamat || '',
            role: userData.role || '',
          });
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Gagal mengambil data pengguna.'); // User feedback on error
      }
    };

    fetchUserData();
  }, [id]); // Run effect when id changes

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle password changes
  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, emailReset);
      toast.success('Email reset password telah dikirim!');
      setShowResetModal(false); // Close modal after sending email
    } catch (error) {
      console.error('Gagal mengirim email reset password:', error);
      toast.error('Terjadi kesalahan. Coba lagi!');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error('Pengguna tidak ditemukan. Silakan login kembali.');
        return;
      }

      // Dapatkan password lama yang dimasukkan oleh pengguna
      const currentPassword = password; // Password lama yang dimasukkan oleh user

      // Re-authenticate dengan kredensial yang benar
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Lanjutkan pembaruan data pengguna
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, { ...formData });

      if (password) {
        await updatePassword(user, password);
        toast.success("Password berhasil diperbarui!");
      } else {
        toast.success("Data berhasil diperbarui!");
      }

      navigate(`/updatePengguna/${id}`);
    } catch (error) {
      console.error("Terjadi kesalahan saat update data:", error);
      toast.error(`Update gagal: ${error.message}`);
    }
  };

  return (
    <div className='relative overflow-y-auto h-screen '>
      <div>

      <div className='lg:bg-white lg:w-screen lg:items-center lg:justify-start lg:flex lg:p-4 lg:h-[63px] lg:sticky lg:top-0 lg:z-10 shadow-lg'>
        <h1 className='font-outfit lg:text-2xl lg:font-semibold hidden lg:block text-gray-800'>Update Pengguna</h1>
      </div>

      <form onSubmit={handleSubmit} className="mb-48 p-6 bg-white shadow-md m-4 rounded-lg grid grid-cols-1 lg:grid-cols-2 lg:items-center lg:justify-center gap-6">
        {/* Input Nama Lengkap */}
        <div className="mb-2">
          <label className="block text-sm font-poppins font-medium mb-1 text-gray-700">Nama Lengkap</label>
          <input
            type="text"
            name="namaLengkap"
            value={formData.namaLengkap}
            onChange={handleChange}
            className="w-full h-14 px-3 font-outfit py-2 border border-gray-300 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Input Email */}
        <div className="mb-2">
          <label className="block text-sm font-poppins font-medium mb-1 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-14 px-3 py-2 border border-gray-300 shadow-sm font-outfit rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>

        {/* Input No Telepon */}
        <div className="mb-2">
          <label className="block text-sm font-poppins font-medium mb-1 text-gray-700">No Telepon</label>
          <input
            type="text"
            name="noTelepon"
            value={formData.noTelepon}
            onChange={handleChange}
            className="w-full h-14 font-outfit border border-gray-300 shadow-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Input Alamat */}
        <div className="mb-2">
          <label className="block text-sm font-poppins font-medium mb-1 text-gray-700">Alamat</label>
          <input
            type="text"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            className="w-full h-14 font-outfit border border-gray-300 shadow-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Select Role */}
        <div className="mb-2">
          <label className="block font-poppins text-sm font-medium mb-1 text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full h-14 font-outfit border border-gray-300 shadow-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>

        {/* Input Password Baru */}
        <div className="mb-2">
          <label className="block font-poppins text-sm font-medium mb-1 text-gray-700">Password Baru</label>
          <button
            type="button"
            onClick={() => setShowResetModal(true)}  // Show reset modal
            className="w-full lg:w-1/2 bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
          >
            Update Password
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full lg:w-1/2 bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
        >
          Update Data
        </button>
      </form>
      </div>

      {/* Modal for password reset */}
      {showResetModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-30'>
          <div className='bg-white p-6 rounded-lg shadow-xl w-[80%] max-w-md'>
            <h3 className='text-xl font-semibold text-gray-800 mb-4'>Reset Password</h3>
            <input
              type="email"
              placeholder="Masukkan email Anda"
              value={emailReset}
              onChange={(e) => setEmailReset(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 mb-4'
            />
            <button
              onClick={handlePasswordReset}
              className='w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2'
            >
              Kirim Link Reset Password
            </button>
            <button
              onClick={() => setShowResetModal(false)}
              className='mt-4 text-center text-gray-500 hover:text-gray-700'
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UpdateUserForm;
