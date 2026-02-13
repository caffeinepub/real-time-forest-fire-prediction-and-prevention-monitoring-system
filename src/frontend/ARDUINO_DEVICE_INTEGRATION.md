# Arduino Device Integration Guide

This document describes how the Arduino UNO device integrates with the Forest Fire Monitoring web application through Firebase Realtime Database and GSM/GPRS SMS functionality.

## Overview

The Arduino UNO device serves as the **data collection and alert transmission layer** for the Forest Fire Monitoring System. It performs three primary functions:

1. **Sensor Data Collection**: Reads environmental data from multiple sensors
2. **Telemetry Upload**: Writes sensor data to Firebase RTDB via GPRS
3. **SMS Alert Transmission**: Sends critical alerts to officers via GSM module

The web application acts as the **monitoring and visualization layer**, reading telemetry from Firebase and displaying it to users.

## Architecture

