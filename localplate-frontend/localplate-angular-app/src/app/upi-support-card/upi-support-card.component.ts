import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upi-support-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upi-support-card.component.html',
  styleUrl: './upi-support-card.component.css'
})
export class UpiSupportCardComponent {

  // ✏️ Customize these inputs when using the component
  @Input() upiId     = '9692167431@axl';
  @Input() name      = 'Buy us a chai ☕';
  @Input() qrImage   = '/assets/images/qr_code2.png'; // path to QR image in /assets/images
  @Input() thankText = 'Your support keeps this going.';

  qrBroken   = false;   // true when the QR image fails to load
  toastVisible = false;
  private toastTimer: any;

  onQrError(): void {
    this.qrBroken = true;
  }

  copyUpiId(): void {
    navigator.clipboard.writeText(this.upiId).then(() => {
      clearTimeout(this.toastTimer);
      this.toastVisible = true;
      this.toastTimer = setTimeout(() => (this.toastVisible = false), 2200);
    });
  }
}
