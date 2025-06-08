import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <form (ngSubmit)="onSubmit()" class="form">
      <div class="form-group" *ngFor="let field of fields">
        <label [for]="field.name">{{ field.label }}</label>
        <input
          [type]="field.type"
          [id]="field.name"
          [name]="field.name"
          [(ngModel)]="formData[field.name]"
          [required]="field.required"
          [placeholder]="field.placeholder"
          class="form-input"
        />
      </div>
      <button type="submit" class="submit-button">{{ submitText }}</button>
    </form>
  `,
    styles: [`
    .form {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      padding: 2rem;
      background-color: var(--color-background);
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--color-primary);
      font-family: var(--font-subtitle-family);
      font-size: var(--font-subtitle-size);
      font-weight: var(--font-subtitle-weight);
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--color-text);
      border-radius: 0.375rem;
      background-color: var(--color-background);
      color: var(--color-primary);
      font-family: var(--font-body-family);
      font-size: var(--font-body-size);
      transition: all 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--color-secondary);
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .form-input::placeholder {
      color: var(--color-text);
      opacity: 0.7;
    }

    .submit-button {
      width: 100%;
      padding: 0.75rem;
      background-color: var(--color-secondary);
      color: var(--color-background);
      border: none;
      border-radius: 0.375rem;
      font-family: var(--font-subtitle-family);
      font-size: var(--font-subtitle-size);
      font-weight: var(--font-subtitle-weight);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .submit-button:hover {
      background-color: var(--color-accent);
      transform: translateY(-1px);
    }

    .submit-button:active {
      transform: translateY(0);
    }

    .submit-button:disabled {
      background-color: var(--color-text);
      cursor: not-allowed;
      opacity: 0.7;
    }

    @media (max-width: 640px) {
      .form {
        padding: 1.5rem;
      }
    }
  `]
})
export class FormComponent {
    @Input() fields: Array<{
        name: string;
        label: string;
        type: string;
        required: boolean;
        placeholder: string;
    }> = [];

    @Input() submitText: string = 'Enviar';
    @Output() formSubmit = new EventEmitter<any>();

    formData: { [key: string]: any } = {};

    onSubmit() {
        this.formSubmit.emit(this.formData);
    }
} 