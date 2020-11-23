import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }


    public loadScript(url: string) {
        const body = document.body as HTMLDivElement;
        const script = document.createElement('script');
        script.innerHTML = '';
        script.src = url;
        script.async = false;
        script.defer = true;
        body.appendChild(script);
    }

    public capitalize(dString: string) {
        return dString.charAt(0).toUpperCase() + dString.slice(1);
    }

    public getNumbersInRange(startIndex: number, endIndex: number) {
        const items: number[] = [];
        for (let i = startIndex; i <= endIndex; i++) {
            items.push(i);
        }
        return items;
    }
}
