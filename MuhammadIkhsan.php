<?php
// Trait pertama untuk Multi Inheritance
trait Logger {
    public function logMessage($message) {
        echo "Logging message: $message<br>";
    }
}

// Trait kedua untuk Multi Inheritance
trait Notifier {
    public function sendNotification($message) {
        echo "Sending notification: $message<br>";
    }
}

// Kelas pertama (kelas induk)
class KelasPertama {
    public function fiturPertama() {
        echo "Nama saya Muhammad Ikhsan Nurfadilah<br>";
    }
}

// Kelas kedua, turunan dari KelasPertama
class KelasKedua extends KelasPertama {
    public function fiturKedua() {
        echo "Saya adalah newbie frontend developer<br>";
    }
}

// Kelas ketiga, turunan dari KelasKedua, dan menggunakan traits untuk Multi Inheritance
class KelasKetiga extends KelasKedua {
    use Logger, Notifier; // Menggunakan traits

    public function fiturKetiga() {
        echo "Keahlian saya dalam front end menggunakan nodejs<br>";
    }
}

// Mulai output buffering
ob_start();

// Membuat objek dari kelas ketiga dan memanggil semua metode yang diwarisi dan trait
$object = new KelasKetiga();

// Memanggil fitur yang diwarisi dari KelasPertama
$object->fiturPertama();

// Memanggil fitur yang diwarisi dari KelasKedua
$object->fiturKedua();

// Memanggil fitur spesifik dari KelasKetiga
$object->fiturKetiga();

// Mengakhiri output buffering dan menampilkan output
ob_end_flush();
?>
