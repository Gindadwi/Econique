import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

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

  const [password, setPassword] = useState(''); // State for new password

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
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Menangani pengiriman form untuk memperbarui data pengguna
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah perilaku pengiriman form yang default (mis. reload halaman)

    try {
      // Membuat objek untuk menyimpan data yang diperbarui dengan menyebarkan data form saat ini
      const updatedData = { ...formData };

      // Jika field password diisi, masukkan ke dalam data yang diperbarui
      if (password) {
        updatedData.password = password; // Tambahkan password baru jika ada
      }

      // Membuat referensi ke dokumen pengguna di Firestore menggunakan ID pengguna
      const userDocRef = doc(db, "users", id); // Referensi ke dokumen pengguna

      // Memperbarui dokumen di Firestore dengan data baru
      await updateDoc(userDocRef, updatedData); // Perbarui dokumen dengan data baru

      // Memberi tahu pengguna bahwa data telah berhasil diperbarui
      toast.success('Data berhasil diperbarui!'); // Menggunakan toast untuk notifikasi sukses

      // Navigasi kembali ke halaman detail pengguna setelah pembaruan
      navigate(`/updatePengguna/:id`); // Kembali ke halaman detail setelah diperbarui
    } catch (error) {
      // Mencetak kesalahan yang terjadi selama proses pembaruan
      console.error('Error updating user data:', error);

      // Memberi tahu pengguna bahwa terjadi kesalahan saat memperbarui data
      alert('Terjadi kesalahan saat update data.'); // Umpan balik pengguna saat terjadi kesalahan
    }
  };


  return (
    <div className='relative overflow-y-auto h-screen '>
      <div className='lg:bg-white lg:w-screen lg:items-center lg:justify-start lg:flex lg:p-4 lg:h-[63px] lg:sticky lg:top-0 lg:z-10 shadow-lg'>
        <h1 className='font-outfit lg:text-2xl lg:font-semibold hidden lg:block text-gray-800'>Reservasi Kegiatan</h1>
      </div>

      <form onSubmit={handleSubmit} className="mb-48 p-6 bg-white shadow-md m-4 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            required
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
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full h-14 font-outfit border border-gray-300 shadow-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan password baru (opsional)"
          />
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

  );
};

export default UpdateUserForm;
