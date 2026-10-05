# Road PotHole Detection System - Community Project 2026

This is the **official documentation** of the RPDS developed for a college **community project by C-13** batch students of **ECE 3rd SEM** from **Vemana Institute of Technology**

## Introduction

**RPDS** is a simple yet efficient solution for **detecting potholes on roads** which are very dangerous to people travelling using their vehicles and also public transport. This RPDS becomes very useful in finding these potholes before taking a route and **awares the driver/passenger about it** and the road's condition. This avoids many accidents or damages that can be happened due to these dangerous potholes.

### The Problem

- Potholes create safety risks for vehicles and road users.
- Manual road inspection is slow, expensive, and difficult to scale.
- Many potholes remain unreported or are reported only after accidents or vehicle damage.
- A vehicle-mounted system can automatically identify abnormal road conditions while travelling.

### The Solution

Build a low-cost prototype that can automatically detect potholes, record their GPS coordinates, estimate severity, and display them on a map. This simple scalable solution consists of both hardware and software systems working together to achieve the primary goal of the RPDS.

#### Core Idea of RPDS

The system detects abnormal vertical acceleration caused by potholes and associates the event with the vehicle's GPS location.

#### Basic Working Architecture of RPDS

```text
        Vehicle
           │
           ▼
   ┌─────────────────┐
   │ Accelerometer   │
   │   MPU6050       │
   └────────┬────────┘
            │
            ▼
          ESP32
     ┌──────┴──────┐
     │             │
   GPS          Detection
     │             │
     └──────┬──────┘
            ▼
       Wi-Fi / 4G / Bluetooth
            │
            ▼
      FastAPI Server
            │
       ┌────┴─────┐
       ▼          ▼
   Database     Dashboard
```

## Methodology

The methodology of this RPDS system relies mainly on the following principles.

### Detection Principle

The **MPU6050** continuously measures acceleration along three axes:

- **X-axis:** longitudinal vehicle movement
- **Y-axis:** lateral vehicle movement
- **Z-axis:** vertical vehicle movement

A pothole can cause a sudden change in vertical acceleration.

```text
Normal road:                            Acceleration:

     ────────╲───────╱────────          ~~~~~~~~~~~~~~~



Pothole:                                Acceleration:

     ───────╲      ╱────────            ~~~~~~~╲__╱~~~~~~
             ╲____╱                              ↑
                ↑                               spike
            Pothole

```

### Problems in this method of approach

But this principle has some limitations like the **acceleration** spikes can also be caused by:

- Speed breakers
- Braking
- Sudden acceleration
- Rough roads
- Turning
- Vehicle suspension

Therefore, a single acceleration threshold is useful for an small beginner system but is not sufficient for a **robust** final system.

### Possible alternate solutions

During our research we found some alternate methods to overcome these limitations.

#### Step 1: Read Sensor Data

Continuously collect the accelerometer data of all three coordinates:

- `ax`
- `ay`
- `az`

#### Step 2: Establish a Baseline

Determine the normal acceleration level while travelling on a smooth road.

#### Step 3: Detect Abnormal Events

Determine the abnormal acceleration or acceleration during potholes level while travelling on a rough road.

```python
if abs(acceleration_z - baseline_z) > THRESHOLD:
    pothole_detected = True
```

#### Step 4: Improve the Detection

Instead of relying on one sample:

- Use a sliding window
- Filter sensor noise
- Analyze the duration of the event
- Consider vehicle speed
- Compare multiple acceleration features

#### Combining the Three Axes

Calculate acceleration magnitude:

```python
import math

magnitude = math.sqrt(
    ax**2 +
    ay**2 +
    az**2
)
```

This provides a more orientation-independent representation of the vehicle's motion.

### Why this method helps?

Using acceleration magnitude can make the system less dependent on the exact sensor mounting orientation and provide a useful feature for classification or classifing using a ML model (like Random forest).

## Improvements in Signal Processing Pipeline

### From Raw Sensor Data to Detection

```text
Sensor
  ↓
Sampling ~100 Hz
  ↓
Noise Filtering
  ↓
Sliding Window
  ↓
Feature Extraction
  ↓
Pothole Classifier
  ↓
GPS Location
```

### Useful Features

- Peak acceleration
- Minimum acceleration
- RMS acceleration
- Change in acceleration
- Event duration
- Number of acceleration peaks
- Vehicle speed

---

## How to contribute?

You can contribute to this project by following a list of protocols set by the project's **official** contributors.

### Our Official Contributors

- Yahya A
- Vignesh V
- Zabiulla M Namazkhan
- Vishal J

You will be always moderated by the project's official contributors whenever there is a pull/push request from your side.

### Rules to contribute

- Fork this repo and modify your changes
- Raise an issue or bug to fix

---

<div align="right">
<i>Researched, designed, developed and documented by Zabi, Vignesh, Yahya and Vishal (Oct 5th, 2026)</i>
</div>
