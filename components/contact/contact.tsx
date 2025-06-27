export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-emerald-700 mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600 mb-10">
          Have a question, suggestion, or just want to say hello? Fill out the
          form below and we&apos;ll get back to you soon.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Handle submission logic here
            alert("Message sent!");
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Tell us more about how we can help..."
            />
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Send Message
            </button>
          </div>
        </form>

        <div className="mt-12 border-t pt-8 text-sm text-gray-500">
          <p>
            Or reach us directly at{" "}
            <a
              href="hello.neurosolutions@gmail.com"
              className="text-emerald-600 underline"
            >
              hello.neurosolutions@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}