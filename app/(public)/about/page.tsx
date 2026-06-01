// app/(public)/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="brand-page-bg min-h-screen px-4 py-12 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-[#4f8f11]">
            Ortak barınak hikayesi
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#171717] mb-4">
            Yuvaya Gel Hakkında
          </h1>
          <p className="text-lg md:text-xl text-[#37357f] max-w-2xl mx-auto">
            Her evcil hayvan sevgi dolu bir yuvayı hak eder. Biz bu bağı kurmak
            için buradayız.
          </p>
        </div>

        {/* Story + Mission in two cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-[2rem] border-4 border-[#37357f] bg-[#fff9df] p-6 shadow-lg md:p-8">
            <h2 className="text-2xl font-bold text-[#37357f] mb-4 flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-[#79c617]" /> Hikayemiz
            </h2>
            <p className="text-[#171717]/75 leading-relaxed">
              Yuvaya Gel, hiçbir hayvanın ailesiz kalmaması gerektiğine dair
              basit bir inançla başladı. Küçük bir barınak olarak başlayan
              yolculuğumuz, hayvanları sevgi dolu ailelerle buluşturan tam
              teşekküllü bir sahiplendirme ve bakım merkezine dönüştü.
            </p>
          </div>

          <div className="rounded-[2rem] border-4 border-[#a71d18] bg-[#fff9df] p-6 shadow-lg md:p-8">
            <h2 className="text-2xl font-bold text-[#37357f] mb-4 flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-[#a71d18]" /> Misyonumuz
            </h2>
            <p className="text-[#171717]/75 leading-relaxed">
              İhtiyaç sahibi hayvanları kurtarıyor, rehabilite ediyor ve yeni
              yuvalarına kavuşturuyoruz. Her sahiplendirme yeni bir
              başlangıçtır. Her hayvanın sağlıklı, aşılı ve yeni bir ailenin
              parçası olmaya hazır olduğundan emin oluyoruz.
            </p>
          </div>
        </div>

        {/* Core Values / Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#171717] text-center mb-10">
            Neden Yuvaya Gel?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🏥",
                title: "Veteriner Bakımı",
                desc: "Tüm hayvanlar tam tıbbi kontrol, aşı ve sahiplendirme öncesi kısırlaştırma işlemlerinden geçer.",
              },
              {
                icon: "❤️",
                title: "Kişiye Özel Eşleştirme",
                desc: "Yaşam tarzınızı öğrenir ve evinize ve kalbinize gerçekten uyan bir hayvanla eşleştiririz.",
              },
              {
                icon: "📋",
                title: "Şeffaf Süreç",
                desc: "Gizli ücret veya sürpriz yok. Evcil hayvanınızın sağlığı ve geçmişi hakkında her şeyi bilirsiniz.",
              },
              {
                icon: "🏡",
                title: "Yüz Yüze Sahiplendirme",
                desc: "Sahiplendirmeler yüz yüze gerçekleşir, böylece yeni arkadaşınızla ilk adımı atmadan önce buluşabilirsiniz.",
              },
              {
                icon: "💬",
                title: "Sürekli Destek",
                desc: "Sahiplendirme sonrası da ekibimiz her soru veya endişenizde yanınızdadır.",
              },
              {
                icon: "🐶🐱",
                title: "Tüm Irklara Açık",
                desc: "Köpekler ve kediler dahil her ırkın, yaşın ve geçmişin hayvanlarıyla ilgileniyoruz.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border-2 border-[#37357f]/15 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:border-[#79c617]"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold text-[#37357f] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#171717]/70 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center rounded-[2rem] border-4 border-[#171717] bg-[#37357f] p-8 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Yeni en iyi arkadaşınızla tanışmaya hazır mısınız?
            <br />
          </h2>
          <Link
            href="/pets"
            className="inline-block bg-[#4f8f11] hover:bg-[#3a6b0d] text-white px-8 py-3 rounded-full font-bold transition-colors"
          >
            Evcil Hayvanlarımızı Gör
          </Link>
        </div>
      </div>
    </div>
  );
}
