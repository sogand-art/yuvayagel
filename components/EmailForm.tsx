export default function EmailForm() {
  return (
    <section className="w-full py-12 px-6 bg-white">
      <div className="max-w-3xl mx-auto bg-main/5 rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-main mb-4 text-center">
          Send Us an Email
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Drop us a message below!
        </p>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main"
          />

          <textarea
            placeholder="Your Message"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main resize-none h-32"
          ></textarea>

          <button
            type="button"
            className="bg-main text-white font-semibold py-3 rounded-lg hover:bg-main/90 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
