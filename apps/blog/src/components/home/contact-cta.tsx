export default function ContactCTA() {
  return (
    <section className="max-w-2xl mx-auto text-center space-y-8">
      <div className="border-t pt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Let&apos;s Connect</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a 
            href="mailto:your-email@example.com" 
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-xl mb-2">📧</span>
            <span className="text-sm font-medium">Email</span>
          </a>
          
          <a 
            href="https://github.com/yourusername" 
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xl mb-2">🐙</span>
            <span className="text-sm font-medium">GitHub</span>
          </a>
          
          <a 
            href="https://linkedin.com/in/yourprofile" 
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xl mb-2">💼</span>
            <span className="text-sm font-medium">LinkedIn</span>
          </a>
          
          <a 
            href="/resume.pdf" 
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            target="_blank"
          >
            <span className="text-xl mb-2">📄</span>
            <span className="text-sm font-medium">Resume</span>
          </a>
        </div>
      </div>
    </section>
  );
}
