const VEHICLES = [
    {
        imei: '100000000000001',
        name: 'Truck 01',
        plate: 'DL 01 AB 1111',
        lat: 28.2380,
        lng: 83.9956,
        speed: 45,
        ignition: true,
        battery: 95,
        timestamp: new Date().toISOString(),
        driver: 'Ramesh Kumar'
    },

    //API data format
    //   {
    //         "vehicle": "KL-08-BW-4256",
    //         "imei": "869137065935074",
    //         "ignition": false,
    //         "speed": 0.0,
    //         "latitude": "010.615201",
    //         "longitude": "076.213961",
    //         "time": "2024-07-30 17:54:06"
    //     }


    {
        imei: '100000000000002',
        name: 'Truck 02',
        plate: 'DL 02 CD 2222',
        lat: 28.2450,
        lng: 83.9870,
        speed: 0,
        ignition: true,
        battery: 72,
        timestamp: new Date().toISOString(),
        driver: 'Suresh Singh'
    },
    {
        imei: '100000000000003',
        name: 'Truck 03',
        plate: 'MH 03 EF 3333',
        lat: 28.2520,
        lng: 84.0050,
        speed: 0,
        ignition: false,
        battery: 45,
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        driver: 'Mahesh Yadav'
    },
    {
        imei: '100000000000004',
        name: 'Truck 04',
        plate: 'MH 04 GH 4444',
        lat: 28.2600,
        lng: 84.0130,
        speed: 62,
        ignition: true,
        battery: 88,
        timestamp: new Date().toISOString(),
        driver: 'Dinesh Patel'
    },
    {
        imei: '100000000000005',
        name: 'Truck 05',
        plate: 'KA 05 IJ 5555',
        lat: 28.2670,
        lng: 84.0210,
        speed: 0,
        ignition: false,
        battery: 15,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        driver: 'Ganesh Verma'
    },
    {
        imei: '100000000000006',
        name: 'Truck 06',
        plate: 'KA 06 KL 6666',
        lat: 28.2740,
        lng: 84.0290,
        speed: 38,
        ignition: true,
        battery: 60,
        timestamp: new Date().toISOString(),
        driver: 'Vijay Sharma'
    },
    {
        imei: '100000000000007',
        name: 'Truck 07',
        plate: 'UP 07 MN 7777',
        lat: 28.2810,
        lng: 84.0370,
        speed: 0,
        ignition: true,
        battery: 80,
        timestamp: new Date().toISOString(),
        driver: 'Anil Gupta'
    },
    {
        imei: '100000000000008',
        name: 'Truck 08',
        plate: 'UP 08 OP 8888',
        lat: 28.2880,
        lng: 84.0450,
        speed: 55,
        ignition: true,
        battery: 33,
        timestamp: new Date().toISOString(),
        driver: 'Ravi Tiwari'
    },
    {
        imei: '100000000000009',
        name: 'Truck 09',
        plate: 'RJ 09 QR 9999',
        lat: 28.2950,
        lng: 84.0530,
        speed: 0,
        ignition: false,
        battery: 55,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        driver: 'Sanjay Mishra'
    },
    {
        imei: '100000000000010',
        name: 'Truck 10',
        plate: 'RJ 10 ST 1010',
        lat: 28.3020,
        lng: 84.0610,
        speed: 71,
        ignition: true,
        battery: 91,
        timestamp: new Date().toISOString(),
        driver: 'Prakash Joshi'
    },
];

export default VEHICLES;