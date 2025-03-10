import { Clipboard } from '@angular/cdk/clipboard';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Material {
  id:string,
  name: string,
  status:boolean,
  value:string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports:[FormsModule]
})
export class AppComponent {
  private clipboard = inject(Clipboard);
  length = signal<number>(0);
  password = signal<string>('');
  isValid = signal<boolean>(false);

  matterials = signal<Material[]>([
      {id:'symbols',name:'Use Symbols',status:false,value:'!@#$%^&*()'},
      {id:'numbers',name:'Use Numbers',status:false,value:'1234567890'},
      {id:'letters',name:'Use Letters',status:false,value:'abcdefghijklmnopqrstuvwyz'}
  ])


  onChangeLength(value: string) {    
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      this.length.set(parsedValue);
    }
  }
  
  onChangeItemStatus(item:Material){
    this.matterials().map((material)=>{
      if(material.name === item.name){
        material.status = !material.status
      }
      this.isValid.set(this.matterials().some(m => m.status));
      return material
    })
  }


  onGenerate() {
    let validChars = '';
    this.matterials().map((material) => validChars += (material.status ? material.value : ''))

    let generatedPassword = '';
    for (let i = 0; i < this.length(); i++) {
      const index = Math.floor(Math.random() * validChars.length);
      generatedPassword += validChars[index];
    }
    this.password.set(generatedPassword);
  }

  onCopyPassword(){
    this.clipboard.copy(this.password());
  }

}
