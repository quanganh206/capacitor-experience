import { Component } from '@angular/core';
import { Plugins, CameraResultType, FilesystemDirectory } from '@capacitor/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
const { Camera, Filesystem } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  path: string = '/assets/shapes.svg';
  constructor(
    private fb: Facebook
  ) { }

  loginFacebook() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
      .catch(e => console.log('Error logging into Facebook', e));
  }

  openCamera() {
    let options = {
      resultType: CameraResultType.Uri
    };

    Camera
      .getPhoto(options)
      .then((photo) => {
        Filesystem.readFile({ path: photo.path })
          .then((result) => {
            let date = new Date(),
              time = date.getTime(),
              fileName = time + '.jpeg';

            Filesystem
              .writeFile({
                data: result.data,
                path: fileName,
                directory: FilesystemDirectory.Data
              })
              .then((result) => {

                Filesystem
                  .getUri({
                    directory: FilesystemDirectory.Data,
                    path: fileName
                  })
                  .then((result) => {
                    console.log(result);
                    // this.path = result.uri.replace('file://', '_capacitor_');
                    this.path = (<any>window).Ionic.WebView.convertFileSrc(result.uri);
                  }, (err) => {
                    console.log(err);
                  });

              }, (err) => {
                console.log(err);
              });

          }, (err) => {
            console.log(err);
          });
      }, (err) => {
        console.log(err);
      });

    // Camera.getPhoto(options).then(
    //   (photo) => {
    //     console.log(photo);
    //   }, (err) => {
    //     console.log(err);
    //   }
    // );
  }
}
