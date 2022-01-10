# Broker untuk smarttandon

Berikut adalah simpel broker untuk perangkat smarttandon projek iot, temen-temen bisa clone repositori untuk codingan microcontrollernya(esp8266) disini, dan untuk web clientnya disini.

## Fitur Broker

- Authentication menggunakan key dari user
- Authorization (publish, subcribe) user untuk spesifik topik
- Kirim automatis ke web client jika ada perangkat tandon baru terhubung
- Kirim automatis notifikasi ke web client

## Cara menggunakan
Install semua module kemudian jalankan servernya

```sh
npm install
npm run start
```

untuk development, install dulu nodemon

```sh
npm install -g nodemon
```

kemudian jalankan mode development 

```sh
npm run dev
```

## Topik 

Topik pada broker ini untuk mengelola data penggunaan air user untuk disimpan ke database, dan juga untuk memberitahu client web jika ada perangkat tandon terhubung, topik bisa diubah jika temen-temen ingin ubah,bisa akses di config/topic.js, konsekuensinya jika temen-temen mengganti topik, client web dan client tandon di ganti topiknya juga, jadi hati-hati jika temen-temen mengganti topik. Berikut default topik yang tersedia di broker ini

| Topik | Deskripsi |
| ------ | ------ |
| mc/status/online | memberitahu client ketika ada perangkat baru terhubung |
| mc/data | menerima data penggunaan air dari microcontroller untuk kemudian di simpan ke database  |


## Struktur Folder

```
apps
└───auth
│             
└───controllers
│
└───db
config
```

### Penjelasan struktur folder
- folder app berisi folder auth, controllers, db(database).
- folder auth berisi authentication untuk perangkat tandon, dan authorization publish dan subscribe untuk user web dan perangkat tandon.
- folder controllers berisi bisnis logik untuk perangkat tandon yang baru terhubung, dan notiifikasi lainnya.
- folder db(database) berisi koneksi ke database mysql, dan kueri-kueri database untuk penyimpanan data penggunaan air, dan sebagainya.
- folder config berisi konfigurasi dari database, topik dan axios.


## License

MIT
