import React, { useState, useEffect } from 'react'
import DashboardHeading from '../components/DashboardHeading'
import DashboardCard from '../components/DashboardCard'
import BottomNav from '../components/BottomNav'
import StatusPendaftaranCard from '../components/StatusPendaftaranCard'
import supabase from '../config/supabaseClient'

const Dashboard = () => {
  const [antrianPasien, setAntrianPasien] = useState([])
  const [pasienID, setPasienID] = useState(null)

  async function getQueue() {
    try {
      const { data, error } = await supabase.from("queues").select("*");
      if (error) throw error;
      if (data) {
        setAntrianPasien(data);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    getQueue()
  }, [])


  async function getUserMetadata() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userID = user.id
    setPasienID(userID)
  }

  getUserMetadata()

  const pasien = antrianPasien.filter((user) => user.user_id === pasienID)

  return (
    <div className='mb-[100px]'>
      <DashboardHeading linkTo="/welcome" heading="Layanan Mudah Pendaftaran & Antrian Pasien Puskesmas (LAMDARANPUS)" />
      <DashboardCard />
      {
        pasien.length === 0 ? <StatusPendaftaranCard /> : (
          pasien.map(user => (
            <StatusPendaftaranCard key={user.id} NomorAntrian={user.queue} JenisPoli={user.poli} NamaPasien={user.name} />
          ))
        )
      }
      <BottomNav />
    </div>
  )
}

export default Dashboard