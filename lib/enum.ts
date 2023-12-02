enum Role {
  PELANGGAN = 'PELANGGAN',
  PENGELOLA_LAUNDRY = 'PENGELOLA_LAUNDRY',
}

enum StatusPesanan {
  MENUNGGU_KONFIRMASI = 'MENUNGGU_KONFIRMASI',
  DIPROSES = 'DIPROSES',
  DIKIRIM = 'DIKIRIM',
  SELESAI = 'SELESAI',
  DITOLAK = 'DITOLAK',
}

enum Tags {
  SEPATU = 'SEPATU',
  BAJU = 'BAJU',
  SEPRAI = 'SEPRAI',
  JAKET = 'JAKET',
}

enum Days {
  SENIN = 'SENIN',
  SELASA = 'SELASA',
  RABU = 'RABU',
  KAMIS = 'KAMIS',
  JUMAT = 'JUMAT',
  SABTU = 'SABTU',
  MINGGU = 'MINGGU',
}

export { Role, StatusPesanan, Tags, Days }
