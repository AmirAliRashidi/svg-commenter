import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root',
})
export class SvgService {
  constructor(private http: HttpClient) {}

  getSvgAsJson(): Promise<any> {
    return this.http
      .get('assets/bg.svg', { responseType: 'text' })
      .toPromise()
      .then((xmlData) => {
        return new Promise((resolve, reject) => {
          xml2js.parseString(xmlData as any, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      });
  }

  convertJsonToSvg(svgJson: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const builder = new xml2js.Builder();
      const svgString = builder.buildObject(svgJson);
      if (svgString) {
        resolve(svgString);
      } else {
        reject('Error converting JSON to SVG string');
      }
    });
  }
}
