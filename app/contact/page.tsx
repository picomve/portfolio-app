export default function ContactPage() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 max-w-2xl bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">Contact</h2>
        <p className="text-slate-600 mb-8">
          Feel free to reach out for freelance work, open-source collaborations, or just a friendly chat.
        </p>
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
