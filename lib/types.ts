import { Days, Role, StatusPesanan, Tags } from './enum'

type User = {
  id: string
  email: string
  name: string
  password: string
  address: string
  image: string
  role: Role
  pesanan: Pesanan[]
  deskripsi?: string
  tags?: Tags[]
  jadwalOperasional?: JadwalOperasional[]
  pemasukan?: Pemasukan[]
  penilaian?: Penilaian[]
}

type Pesanan = {
  id: string
  berat: number
  harga: number
  status: StatusPesanan
  waktuPesanan: Date
  waktuPenyelesaian: Date
  pelangganId: string
  pengelolaLaundryId: string
}

type JadwalOperasional = {
  id: string
  hari: Days
  jamBuka: string
  jamTutup: string
  pengelolaLaundryId: string
}

type Pemasukan = {
  id: string
  nominal: number
  Date: Date
  pengelolaLaundryId: string
}

type Penilaian = {
  id: string
  rating: number
  ulasan: string
  pengelolaLaundryId: string
}

export type { User, Pesanan, JadwalOperasional, Pemasukan, Penilaian }
