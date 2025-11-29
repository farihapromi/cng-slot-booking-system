'use client';

import Navbar from '@/components/Navbar';

import Contact from './contact/page';
import Link from 'next/link';
import About from './about/page';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className='relative flex flex-col items-center justify-center text-center py-24 px-4 md:px-0 bg-gradient-to-r from-blue-300 to-blue-500 text-white'>
        <h1 className='text-4xl md:text-6xl font-bold mb-6'>
          Fuel Booking Made Easy
        </h1>
        <p className='text-lg md:text-xl max-w-2xl mb-8'>
          Reserve your CNG, Petrol, or Diesel fuel slots in advance and avoid
          long queues. Track your bookings and refill on time.
        </p>
        <a
          href='/sign-up'
          className='bg-blue-600 text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transition'
        >
          Get Started
        </a>
      </section>

      {/* Features Section */}
      <section id='features' className='py-16 px-4 md:px-0 max-w-7xl mx-auto'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-12'>
          Features
        </h2>
        <div className='grid md:grid-cols-3 gap-8 text-center'>
          <div className='p-6 bg-white rounded-xl shadow hover:shadow-lg transition'>
            <h3 className='text-xl font-semibold mb-2'>Book Slots</h3>
            <p className='text-gray-600'>
              Reserve your fuel slot in advance and save time.
            </p>
          </div>
          <div className='p-6 bg-white rounded-xl shadow hover:shadow-lg transition'>
            <h3 className='text-xl font-semibold mb-2'>Real-Time Tracking</h3>
            <p className='text-gray-600'>
              Track your booking status and get notifications.
            </p>
          </div>
          <div className='p-6 bg-white rounded-xl shadow hover:shadow-lg transition'>
            <h3 className='text-xl font-semibold mb-2'>Cancel / Reschedule</h3>
            <p className='text-gray-600'>
              Manage your slots easily with cancel or reschedule options.
            </p>
          </div>
        </div>
      </section>

      {/* Full About Section */}
      <section
        id='about'
        className='py-16 bg-gray-100 px-4 md:px-0 max-w-4xl mx-auto text-center'
      >
        <h2 className='text-3xl font-bold mb-6'>About FuelEase</h2>
        <p className='text-gray-700 text-lg mb-4'>
          FuelEase is a modern fuel booking system designed for CNG and petrol
          vehicles. Our mission is to save your time by allowing you to reserve
          fuel slots in advance and avoid long queues.
        </p>
        <p className='text-gray-700 text-lg'>
          Track your bookings in real-time, manage your slots easily, and get
          notifications for your next refill. FuelEase ensures smooth and
          hassle-free refueling experiences.
        </p>
      </section>

      {/* Full Contact Section */}
      <section
        id='contact'
        className='py-16 bg-white px-4 md:px-0 max-w-4xl mx-auto text-center'
      >
        <h2 className='text-3xl font-bold mb-6'>Contact Us</h2>
        <p className='text-gray-700 text-lg mb-4'>
          Have questions or feedback? We’d love to hear from you.
        </p>
        <form className='flex flex-col gap-4 max-w-xl mx-auto'>
          <input
            type='text'
            placeholder='Your Name'
            className='p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600'
          />
          <input
            type='email'
            placeholder='Your Email'
            className='p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600'
          />
          <textarea
            placeholder='Message'
            rows={5}
            className='p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600'
          />
          <button className='bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition'>
            Send Message
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className='bg-gray-800 text-white text-center py-6 mt-16'>
        &copy; 2025 FuelEase. All rights reserved.
      </footer>
    </div>
  );
}
