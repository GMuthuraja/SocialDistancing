import { Component } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { BLE } from '@ionic-native/ble/ngx';

declare global {
  interface Window {
    ble: any;
    device: any;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  message: any;
  serviceId = 'ESTAFF';
  devices = [];
  spinner: boolean = true;


  constructor(
    private ble: BLE,
    private bluetoothle: BluetoothLE) {

    setTimeout(() => {
      this.ble.startStateNotifications().subscribe(r => {
        this.onInitializeBluetooth(r);
      }, (e) => {
        this.onError(e);
      });
    }, 1000);

  }

  onInitializeBluetooth(s: any) {
    console.log(s);
    if (s === 'off') {
      this.devices = [];
      if (window.device.platform === 'Android') {
        this.ble.enable().then(r => {
          this.onResponse(r);
        }, (e) => {
          this.onError(e);
        });
      } else {
        alert('Please enable bluetooth');
      }
    }

    if (s === 'on') {
      this.isLocationOn();
      this.collectDevices();
      this.tryAdvertising();
    }
  }

  tryAdvertising() {
    const serviceParams = {
      services: [this.serviceId],
      service: this.serviceId,
      name: `${window.device.platform} ${window.device.model}`,
      mode: 'balanced',
      txPowerLevel: 'high',
      connectable: false,
      includeDeviceName: true,
      timeout: 0
    };

    this.keepAdvertisingRunning(serviceParams);
  }

  keepAdvertisingRunning(serviceParams: any) {
    console.log(serviceParams);
    if ((window.device.platform === 'Android')) {
      console.log('android');

      this.bluetoothle.initialize().subscribe(r => {
        this.onResponse(r);
      }, (e) => {
        this.onError(e);
      });

      this.bluetoothle.startAdvertising(serviceParams).then(r => {
        console.log('advertising: ', r);
      }, (e) => {
        this.onError(e);
      });
    } else {
      console.log('ios running');
      this.bluetoothle.initializePeripheral().subscribe(r => {
        console.log('started: ', r);
        this.bluetoothle.startAdvertising(serviceParams).then(r => {
          console.log('advertising: ', r);
        }, (e) => {
          this.onError(e);
        });
      }, (e) => {
        this.onError(e);
      });
    }
  }

  onError(e: any) {
    console.log('Error trying to get device', e);
  }

  onResponse(r?: any): any {
    console.log(r);
  }


  isLocationOn() {
    window.ble.isLocationEnabled(this.onResponse,
      (e) => {
        alert('Please enable location services');
      }
    );
  }

  collectDevices() {
    this.ble.startScanWithOptions([], { reportDuplicates: true }).subscribe(r => {
      this.onDiscoverDevice(r);
    }, (e) => {
      this.onError(e);
      this.spinner = false;
      this.message = "Failed. Please wait as we are trying again.";
    });

    setTimeout(() => {
      if (this.spinner) {
        this.spinner = false;
        this.message = 'Thanks for keeping distance';
      }
    }, 10000);
  }


  filterDevices(device: any) {
    const devicesList = [
      'TV',
      'MacBook',
      '[AV] Samsung',
      'Charger',
      'JBL'
    ];

    return devicesList.some(d => {
      if (!device.name) return false;
      return device.name.indexOf(d) > -1;
    });
  }

  onDiscoverDevice(device) {
    console.log(device);

    if (this.filterDevices(device)) return;

    const match = this.devices.find((e: any) => e.id === device.id);
    if (!match) {
      this.devices.push(device);
    }

    this.getDistance(device);
  }

  getDistance(device) {
    const power = -69;
    let distance = Math.pow(10, (power - device.rssi) / (10 * 2)).toFixed(2);
    this.spinner = false;
    if (parseInt(distance) < 1) {
      this.message = "Please keep distance";
    } else {
      this.message = "Thanks for keeping distance";
      this.devices = [];
    }
  }

}
