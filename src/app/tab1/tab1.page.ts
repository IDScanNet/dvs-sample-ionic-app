import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import IDVC from '@idscan/idvc';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: [
    'tab1.page.scss',
    '../../../node_modules/@idscan/idvc/dist/css/idvc.css',
  ],
})
export class Tab1Page implements OnInit {
  constructor() {}

  ngOnInit(): void  {
    const idvc = new IDVC({
      el: 'videoCapturingEl',
      licenseKey: '',
      networkUrl: 'assets/networks',
      resizeUploadedImage: 1500,
      fixFrontOrientAfterUpload: false,
      autoContinue: false,
      isShowDocumentTypeSelect: false,
      realFaceMode: 'auto',
      useCDN: false,
      documentTypes: [
        {
          type: 'ID',
          steps: [
            {
              type: 'front',
              name: 'Document Front',
            },
            {
              type: 'pdf',
              name: 'Document PDF417 Barcode',
            },
            {
              type: 'face',
              name: 'Face',
            },
          ],
        },
      ],
      onChange(data) {
        console.log('on change', data);
      },
      onCameraError(data) {
        console.log('camera error', data);
      },
      onReset(data) {
        console.log('on reset', data);
      },
      onRetakeHook(data) {
        console.log('retake hook', data);
      },
      submit(data) {
        idvc.showSpinner(true);
        let pdfStep, faceStep, mrzStep;
        let frontImage, backImage;
        let trackString;
        let captureMethod;

        switch (data.documentType) {
          // Drivers License and Identification Card
          case 1:
            pdfStep = data.steps.find((item) => item.type === 'pdf');

            backImage = pdfStep.img.split(/:image\/(jpeg|png);base64,/)[2];

            trackString =
              pdfStep && pdfStep.trackString ? pdfStep.trackString : '';

            captureMethod = JSON.stringify(+pdfStep.isAuto);

            break;
          // US and International Passports
          case 2:
            mrzStep = data.steps.find((item) => item.type === 'mrz');

            frontImage = mrzStep.img.split(/:image\/(jpeg|png);base64,/)[2];

            trackString = mrzStep && mrzStep.mrzText ? mrzStep.mrzText : '';

            captureMethod = JSON.stringify(+mrzStep.isAuto);

            break;

          default:
        }

        let request = {
          authKey: '',
          text: trackString,
        };

        fetch('', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(request),
        })
          .then((response) => response.json())
          .then((data) => {
            idvc.showSpinner(false);
            console.log(data);
          })
          .catch((err) => {
            idvc.showSpinner(false);
            console.log(err);
          });
      },
    });
  }
}
