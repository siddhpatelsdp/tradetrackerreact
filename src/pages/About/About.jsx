import React, { useState } from 'react';
import './About.css';

function About() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formResult, setFormResult] = useState({
    show: false,
    message: '',
    isSuccess: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormResult({ show: false, message: '', isSuccess: false });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('access_key', '532edd60-5525-4a77-8cfe-29de2384cbe5');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        setFormResult({
          show: true,
          message: 'Message sent successfully!',
          isSuccess: true
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormResult({
          show: true,
          message: `Error: ${result.message || 'Failed to send message. Please try again.'}`,
          isSuccess: false
        });
      }
    } catch (error) {
      setFormResult({
        show: true,
        message: 'Error: Failed to send message. Please try again.',
        isSuccess: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="about-page">
      <main className="contact-main">
        <div className="contact-container">
          <div className="contact-column about-and-info">
            <section className="about-us">
              <h1>About Us.</h1>
              <p>At Trade Tracker, we believe that tracking and analyzing trades should be simple, efficient, and insightful. Our platform is designed to help traders log their trades, monitor performance, and refine their strategies—all in one place. Whether you're a beginner learning the markets or an experienced trader optimizing your edge, our tools make trade management seamless.</p>
            </section>

            <section className="contact-info">
              <h1>Contact Information:</h1>
              <p>Email: <a href="mailto:support@tradetracker.com">support@tradetracker.com</a></p>
              <p>Phone: <a href="tel:18001234567">1-800-123-4567</a></p>
            </section>
          </div>

          <div className="contact-form-container">
            <h1>Get In Touch.</h1>
            <p>Have questions or feedback? Fill out the form below!</p>
            <section className="contact-form">
              <form id="contact-form" onSubmit={handleSubmit}>
                <input type="hidden" name="access_key" value="532edd60-5525-4a77-8cfe-29de2384cbe5" />
                
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
                
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              
              {formResult.show && (
                <div 
                  id="form-result"
                  style={{ 
                    display: 'block',
                    color: formResult.isSuccess ? 'var(--accent-color)' : 'red',
                    marginTop: '1rem'
                  }}
                >
                  {formResult.message}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default About;