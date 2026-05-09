import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-section.component.html',
  styleUrl: './feedback-section.component.css'
})
export class FeedbackSectionComponent {
  formData = {
    name: '',
    shopName: '',
    message: ''
  };

  isSubmitting = false;
  submitMessage = '';
  submitError = '';

  onSubmit(): void {
    if (!this.formData.name || !this.formData.message) {
      this.submitError = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    // Create a simple mailto link and trigger it
    const subject = `LocalPlates Feedback: ${this.formData.shopName || 'General'}`;
    const body = `Name: ${this.formData.name}\nShop: ${this.formData.shopName || 'N/A'}\n\nMessage:\n${this.formData.message}`;
    const mailtoLink = `mailto:inertia.icse@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Simulate sending and then reset
    try {
      window.location.href = mailtoLink;
      this.submitMessage = 'Thank you for your feedback! Opening email client...';
      // Reset form after success
      setTimeout(() => {
        this.formData = { name: '', shopName: '', message: '' };
        this.submitMessage = '';
        this.isSubmitting = false;
      }, 2000);
    } catch (error) {
      this.submitError = 'Failed to send feedback. Please try again.';
      this.isSubmitting = false;
    }
  }

  resetForm(): void {
    this.formData = { name: '', shopName: '', message: '' };
    this.submitMessage = '';
    this.submitError = '';
  }
}
