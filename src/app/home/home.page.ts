import { Component, NgZone } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  devices: any[] = [];
  warning: any;

  constructor(private ble: BLE, private ngZone: NgZone) { }

  Scan() {
    this.devices = [];
    setInterval(() => {
      this.ble.scan([], 10000).subscribe(device => {
        this.onDeviceDiscovered(device)
      });
    }, 1000);
  }

  onDeviceDiscovered(device) {
    console.log(device);
    this.ngZone.run(() => {
      if (this.devices.length > 0) {
        for (let i = 0; i < this.devices.length; i++) {
          if (this.devices[i].id != device.id) {
            this.devices.push(device);
          }
          this.calculateDistance(device);
        }
      } else {
        this.calculateDistance(device);
        this.devices.push(device);
      }
    })
  }

  calculateDistance(device) {
    let exp = (-69 - (device.rssi)) / (10 * 2);
    if (Math.pow(10, exp) < 1) {
      this.warning = "Please keep distance..." +
        "\n"
        + "Current Distance: " + Math.pow(10, exp) + " Mtrs" +
        "\n"
        + "Device ID: " + device.id;
    } else {
      this.warning = "Thanks for Keep distance";
    }
  }

  //   unpairedDevices: any;
  //   pairedDevices: any;
  //   gettingDevices: boolean;

  //   constructor(
  //     private bluetoothSerial: BluetoothSerial,
  //     private bluetoothle: BluetoothLE,
  //     private ble: BLE,
  //     private alertController: AlertController) {
  //     bluetoothSerial.enable();
  //   }

  //   startScanning() {
  //     this.bluetoothle.initialize().subscribe(init => {
  //       this.bluetoothle.startScan({}).subscribe(scan => {
  //         console.log(scan);
  //       });
  //     });
  //   }

  //   disconnect(){
  //     this.bluetoothle.stopScan().then(stop => {
  //       console.log(stop);
  //     });
  //   }

  //   // startScanning() {
  //   //   this.pairedDevices = null;
  //   //   this.unpairedDevices = null;
  //   //   this.gettingDevices = true;
  //   //   const unPair = [];
  //   //   this.bluetoothSerial.discoverUnpaired().then((success) => {
  //   //     console.log(success);
  //   //     success.forEach((value, key) => {
  //   //       var exists = false;
  //   //       unPair.forEach((val2, i) => {
  //   //         if (value.id === val2.id) {
  //   //           exists = true;
  //   //         }
  //   //       });
  //   //       if (exists === false && value.id !== '') {
  //   //         unPair.push(value);
  //   //       }
  //   //     });
  //   //     this.unpairedDevices = unPair;
  //   //     this.gettingDevices = false;
  //   //   },
  //   //     (err) => {
  //   //       console.log(err);
  //   //     });

  //   //   this.bluetoothSerial.list().then((success) => {
  //   //     this.pairedDevices = success;
  //   //     console.log(JSON.stringify(success));
  //   //   }, (err) => {

  //   //   });
  //   // }

  //   // success = (data) => {
  //   //   console.log(data);
  //   //   this.deviceConnected();
  //   // }

  //   // fail = (error) => {
  //   //   console.log(error);
  //   //   alert(error);
  //   // }

  //   // async selectDevice(id: any) {

  //   //   const alert = await this.alertController.create({
  //   //     header: 'Connect',
  //   //     message: 'Do you want to connect with?',
  //   //     buttons: [
  //   //       {
  //   //         text: 'Cancel',
  //   //         role: 'cancel',
  //   //         handler: () => {
  //   //           console.log('Cancel clicked');
  //   //         }
  //   //       },
  //   //       {
  //   //         text: 'Connect',
  //   //         handler: () => {
  //   //           console.log(id);
  //   //           this.bluetoothSerial.connect(id).subscribe(res => {
  //   //             console.log(res);
  //   //             this.bluetoothSerial.readRSSI().then(rsi => {
  //   //               console.log(rsi);
  //   //             });
  //   //           });
  //   //         }
  //   //       }
  //   //     ]
  //   //   });
  //   //   await alert.present();
  //   // }

  //   // deviceConnected() {
  //   //   this.bluetoothSerial.isConnected().then(success => {
  //   //     alert('Connected Successfullly');
  //   //   }, error => {
  //   //     console.log(error);
  //   //     alert('error' + JSON.stringify(error));
  //   //   });
  //   // }

  //   // async disconnect() {
  //   //   const alert = await this.alertController.create({
  //   //     header: 'Disconnect?',
  //   //     message: 'Do you want to Disconnect?',
  //   //     buttons: [
  //   //       {
  //   //         text: 'Cancel',
  //   //         role: 'cancel',
  //   //         handler: () => {
  //   //           console.log('Cancel clicked');
  //   //         }
  //   //       },
  //   //       {
  //   //         text: 'Disconnect',
  //   //         handler: () => {
  //   //           this.bluetoothSerial.disconnect();
  //   //         }
  //   //       }
  //   //     ]
  //   //   });
  //   //   await alert.present();
  //   // }

}
