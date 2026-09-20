# par-ici-tennis (*Parisii tennis*)

Script to automatically book a tennis court in Paris (on https://tennis.paris.fr)

> "Par ici" mean "this way" in french. The "Parisii" were a Gallic tribe that dwelt on the banks of the river Seine. They lived on lands now occupied by the modern city of Paris. The project name can be interpreted as "For a Parisian tennis, follow this way"

**NOTE**: They added a CAPTCHA during the reservation process. The latest version **should** pass through. If it fails, open an issue with error logs, I will try to find another way.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Get started](#get-started)
  - [Configuration](#configuration)
  - [Ntfy notifications (optional)](#ntfy-notifications-optional)
  - [Payment process](#payment-process)
  - [Running](#running)
    - [On your machine](#on-your-machine)
    - [Using GitHub Actions (beta)](#using-github-actions-beta)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites
- Node.js >= 20.6.x
- A "carnet de réservation" in your Paris Tennis account (see [Payment process](#payment-process))

## Get started

### Configuration

Create `config.json` file from `config.json.sample` and complete with your preferences.

- `location`: a list of courts ordered by preference - [full list](https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=tennisParisien&view=les_tennis_parisiens)

You can use two formats for the `locations` field:

1) **Array format:**
  ```json
  "locations": [
    "Valeyre",
    "Suzanne Lenglen",
    "Poliveau"
  ]
  ```
  Use this if you want to search all courts at each location, in order of preference.

2) **Object format (with court numbers):**
  ```json
  "locations": {
    "Suzanne Lenglen": [5, 7, 11],
    "Henry de Montherlant": []
  }
  ```
  Use this if you want to specify court numbers for each location. An empty array means all courts at that location will be considered.

Choose the format that best matches your preferences.

- `date` (optional) a string representing a date formatted D/M/YYYY. Prefer omitting it to always book **6 days ahead** as soon as slots open
- `day` (optional) weekday name (`friday` / `vendredi`, …). With no `date`, only books when D+6 is that weekday (useful for daily CI). Ignored if `date` is set

See [doc/tennis-sites.md](doc/tennis-sites.md) for location names by arrondissement.

- `hours` a list of hours ordered by preference

- `priceType` an array containing price types you can book `Tarif plein` and/or `Tarif réduit`

- `courtType` an array containing court types you can book `Découvert` and/or `Couvert`

- `players` list of players 3 max (without you)

### Ntfy notifications (optional)

You can configure the script to send notifications with the reservation details and the ics file via [ntfy](https://ntfy.sh), a simple pub-sub notification service.

To receive notifications:
- Choose a unique topic name (e.g., `YOUR-UNIQUE-TOPIC-NAME` — choose something unique and hard to guess, as there is no password protection for subscriptions)
- Subscribe to your topic using the [ntfy mobile app](https://ntfy.sh/docs/subscribe/phone/) or [web interface](https://ntfy.sh/)

To enable ntfy notifications in script, add the following configuration to your `config.json`:

```json
"ntfy": {
  "enable": true,
  "topic": "YOUR-UNIQUE-TOPIC-NAME"
}
```

Configuration options:
- `enable`: set to `true` to enable ntfy notifications
- `topic`: your unique ntfy topic name chosen previously
- `domain` (optional): custom ntfy server domain (`ntfy.sh` used if empty)

Notification example:

![Notification example](doc/ntfy.png)

### Payment process

To pass the payment phase without trouble you need a "carnet de réservation", be careful you need a "carnet" that matches your `priceType` & `courtType` [combination](https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=rate&view=les_tarifs) selected previously

### Running

#### <ins>On your machine</ins>

To run this project locally, install the dependencies

```sh
npm install
```

and run the script:

```sh
npm start
```

To test your configuration, you can run this project in dry-run mode. It will check court availability but no reservations will be made:

```sh
npm run start-dry
```

You can start the script automatically using cron or equivalent

#### <ins>Using GitHub Actions (beta)</ins>

> [!IMPORTANT]
> GitHub Actions scheduled triggers can start a few minutes late. The workflow therefore starts at **07:40** Paris time, logs in early, then waits until **08:00** before searching — so booking fires right as slots open. If login finishes **after 08:00**, an ntfy late-start warning is sent (needs `NTFY_TOPIC` / ntfy config).

You can automate the booking using GitHub Actions workflows. The repository includes pre-configured workflows:

1. **[Fork this repository](https://github.com/bertrandda/par-ici-tennis/fork)** to your own GitHub account (if you find this repository useful, you can also give it a star ⭐)

2. **Configure GitHub secrets and variables:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Add the following **secrets**:
     - `ACCOUNT_EMAIL`: your Paris Tennis email
     - `ACCOUNT_PASSWORD`: your Paris Tennis password
     - `NTFY_TOPIC`: (optional) your ntfy topic for notifications
     - `NTFY_DOMAIN`: (optional) custom ntfy server domain if you don't use `ntfy.sh`
   - Add a **variable**:
     - `CONFIG_JSON`: the content of your `config.json` file (⚠️ without account credentials and ntfy config — use secrets instead). Omit `date`; use `day` if you only want one weekday (e.g. `"day": "friday"` → books on Saturdays when Friday opens)

3. **Enable workflow:**
   - Go to the Actions tab and enable the `Tennis booking` workflow
   - It runs **daily** at 07:40 Paris time: login → wait until 08:00 → book
   - Late start (ready after 08:00) → ntfy warning if configured
   - Manual runs (`workflow_dispatch`) skip the wait and book immediately

To test Github Actions config you can start `Tennis booking dry-run` workflow manually. It will check court availability but no reservations will be made.

Locally, same timing behaviour:

```sh
npm run start-wait
```

## Contributing

Contributions and bug reports are welcome! Please open an [issue](https://github.com/bertrandda/par-ici-tennis/issues) or submit a [pull request](https://github.com/bertrandda/par-ici-tennis/pulls).

## License

MIT
