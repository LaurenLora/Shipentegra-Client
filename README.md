TODO List Uygulaması

UYgulama ilk açıldığında 2 saniyelik preloader olacak.

Uygulama Türkçe ve ingilizce olarak 2 dil desteği sağlayacak (Title,placeholder,form eleman değerleri).Uygulamada dil değiştirince sayfa yenilenmeden statik textler anında değişmelidir.

Todo Hem Lokal dbde hem de trelloda tutlacaktır. Yeni bir todo eklendiğinde,güncellendiğinde veya silindiğinde trello'da da card ekleme/güncelleme/silme işlemi olacaktır.

# Trello api için gerekli olan anahtarları ve idler

# Key:

# Token:

# Board id: Trello hesabı açıldıktan sonra bir board olusturup yine api isteği bu board id alabilirsibiz.

Trello api docs: https://developer.atlassian.com/cloud/trello/rest/

TODO Özellikleri

Her todonun bir önem derecesi durumu olacak. Bu listeleme,silme ve düzenleme sırasında görünecek. Bunların değerleri yüksek,orta ve düşük olacak.

Her todonun aktiflik durumu da olacak.Bunların değerleri ise aktif ve tamamlandı şeklinde olacak.Tamamlanan bir todo tekrardan aktif edilemeyecek.

Her todo bir sizin tarafınızdan oluşturulup dbde saklanan kategorilerden birine ait olacak.

1- Kullanıcı todo ekleme sayfası olacak. Bu sayfada kullanıcı kategori seçebilecek ( 5 tane kategori olması yeterlidir. Bunlar size kalmış. Örn Genel,İngilizce Kursu,Faturalar vs) . Ayrıca kullanıcı resim de ekleyebilecek. Sonra listelerken bunları eğer varsa thumbnail gösterecek .

2- Listeleme sayfası olacak. Burada todo bilgileri yer alacak. Ekleme tarihi, todo, kategori,durum,varsa resim,işlemler( düzenleme, silme ve durum değiştirme)

3- Her sayfada 5 adet todo listenebilecek. Sayfalama oalcak. Kullanıcı hangi sayfada ise , sayfalama linklerinde o sayfanın numarası tıklanabilir olmayacak

4- Filtreleme olacak. Bu alanlar başlangıç-bitiş tarihi,tamamlanma durumu(aktif-tamamlandı), 1. maddedeki kategoriler ve önem durumu olmak üzere 4 filtre alanı olacak.

5- 2.maddedeki işlemler
Silme - Her bir todo silinebilir
Düzenleme - Düzenleme sayfası ve modalı açılıp burada ekleme kısmında yaptığı her şeyi yapabilir.
Önem derecesini değiştirme (her bir satırda select box kullanarak yapılabilir )
Tamamlandı. Aktif olan todo tamamlandı işaretlenebilir. Tersi olamaz

Projede Frontend tarafında Vue, Backend tarafında ise Nodejs kullanılması gerekiyor.

API istekleri için Axios kulllanılmalı ve istekleri göndermeden gerekli gördüğünüz alanlarda doğrulama yapılmalı. Örneğin resim varsa uzantısı png veya jpeg olmalı max todo uzunluğu 100 karakter olmalı gibi

Veritabanı olarak mysql kullanılmalıdır. Trelloda yer alan board ve card idleri de bu dbde tutulmalıdır

Uygulamada Vue ile oluşturulacağı için componentleri aktif şekilde kullanmaya özen gösterilmeli. Örneğin listeleme yapılırken her bir satır verileri bir modele atanmalı ve model üzerinden işlem yapılmalı veya filtreleme kısmı bir component olmalı gibi
