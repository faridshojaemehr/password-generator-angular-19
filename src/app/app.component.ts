import { Clipboard } from '@angular/cdk/clipboard';
import { Component, inject, Resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IResource } from './resourse.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [FormsModule],
})
export class AppComponent {
  private clipboard = inject(Clipboard);
  length = signal<number>(0);
  password = signal<string>('');
  isValid = signal<boolean>(false);

  characterOptions = signal<IResource[]>([
    { id: 'symbols', name: 'Use Symbols', status: false, value: '!@#$%^&*()' },
    { id: 'numbers', name: 'Use Numbers', status: false, value: '1234567890' },
    {
      id: 'letters',
      name: 'Use Letters',
      status: false,
      value: 'abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWYZ',
    },
  ]);

  onChangeLength(value: string) {
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      this.length.set(parsedValue);
    }
  }

  onChangeItemStatus(item: IResource) {
    this.characterOptions().map((material) => {
      if (material.name === item.name) {
        material.status = !material.status;
      }

      const hasValidMaterial = this.characterOptions().some(
        (material) => material.status
      );
      this.isValid.set(hasValidMaterial);
      console.log(this.isValid());
      console.log(this.characterOptions());
    });
  }

  onGenerate() {
    let validChars = '';
    this.characterOptions().map(
      (material) => (validChars += material.status ? material.value : '')
    );

    let generatedPassword = '';
    // First, ensure at least one character from each selected category
    this.characterOptions().forEach((option) => {
      if (option.status && option.value.length > 0) {
        const randomIndex = Math.floor(Math.random() * option.value.length);
        generatedPassword += option.value[randomIndex];
      }
    });

    // Fill the rest with random characters from all valid chars
    while (generatedPassword.length < this.length()) {
      const index = Math.floor(Math.random() * validChars.length);
      generatedPassword += validChars[index];
    }

    // Shuffle the password to make it more random
    generatedPassword = generatedPassword
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
    this.password.set(generatedPassword);
  }

  onCopyPassword() {
    this.clipboard.copy(this.password());
  }
}
