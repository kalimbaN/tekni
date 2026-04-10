import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const sections = [
    {
      title: 'For Users',
      links: [
        { name: 'How it works', href: '/how-it-works' },
        { name: 'Safety tips', href: '/safety' },
        { name: 'Support center', href: '/support' },
        { name: 'FAQs', href: '/faqs' },
      ],
    },
    {
      title: 'For Providers',
      links: [
        { name: 'Become a commission agent', href: '/become-agent' },
        { name: 'Become a service provider', href: '/become-provider' },
        { name: 'Advertise with us', href: '/advertise' },
        { name: 'Seller resources', href: '/seller-resources' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of service', href: '/terms' },
        { name: 'Privacy policy', href: '/privacy' },
        { name: 'Refund policy', href: '/refund' },
        { name: 'Cookie policy', href: '/cookies' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Blog', href: '/blog' },
        { name: 'Press', href: '/press' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="font-semibold mb-4 text-gray-100">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Tekni
              </span>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">Rwanda</span>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
            </div>
            
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Tekni Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;