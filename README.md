# Funding Navigator

## Purpose

This application, begun in the context of **"Hack4SocialGood 2026"**, is intended to simplify and optimize the path between sources of social funding and those who need it in the canton of Zurich.


## Development notes

### Setting up the development environment

If you don't already have the development tools in place and a little know-how on the subject, setting this environment up the first time will be a pain in the ass. But once it's in place, making modifications and updating your code with changes from the other developers will be relatively easy.

*If you need any help with any of the stuff below to get your dev environment up and running, feel free to reach out to me (Kelly). I'll be happy to connect to your machine via Teamviewer and help out.*

#### Prerequisites

- Git (https://git-scm.com/install/)
- Docker Desktop (https://docs.docker.com/get-started/get-docker/) - *Note: Windows users can also install Docker Desktop via the Windows Store.*

If asked, choose a "Linux" setup when installing.

#### Downloading and setting up the app

On your local machine, create a development directory if you don't have one. (In the examples below, I'll use `C:\devel` as the development directory.) Open a command prompt in this directory and clone our project's Git repository:

    git clone https://github.com/jkcollier/funding-navigator.git

Go into the repository's new sub-directory:

    C:\devel> cd funding-navigator

Set up your environment files, using the examples that are more or less ready to run as is:

    C:\devel\funding-navigator> copy .env.example .env
    C:\devel\funding-navigator> copy docker-compose.yml.example docker-compose.yml




### Using the dev tools

#### pgAdmin - the Database navigator

`pgAdmin` provides a web interface to the database, so that we can view and even modify the database's data or structure. (For the most part, we just use it to view the data structure itself.)

Ensure that the application's three Docker containers are running. (See above for more info.) To connect to `pgAdmin`, point your web browser to http://localhost:5050.

*Note: If this doesn't work, check your `docker-compose.yml` file; therein, under the `pgadmin` container -> `ports`, you'll see something like `"5050:80"`. In this case, the `pgadmin` application is running on port 5050. Use whatever port is noted here (on the left) in the URL (http://localhost:5050).*

The first time you connect to `pgAdmin`, it will require you to enter an admin password. This password is arbitrary, and local to the test database on your machine, so choose whatever you wish, even a ridiculously simple password.

- Right-click on `Servers` in the left pane.
- Select `Register` -> `Server...`
- Enter the Name `db`
- Click on the `Connection` tab
  - `Host name/address`: "db"
  - `Username`: "appuser" (or whatever the value of `POSTGRES_USER` is in your `.env` file)
  - `Password`: "apppassword" (or whatever the value of `POSTGRES_USER` is in your `.env` file)
- Click on `Save`.

You can now expand `Servers` -> `db` -> `Databases`, and you will see `appdb`, which is our app's database.

To see the database's tables:
- Expand `Schemas`
- Expand `public`
- Expand `Tables`

For a given table, you can view the different fields by selecting `Columns`, then `Properties` on the right.

If you want to view the data, right-click the table's name, then "View/Edit Data".



## Original `README.md` (from Arjun's front end, I think):

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

For iOS development: Xcode (macOS only)

For Android development: Android Studio (optional)

### Quick Setup
- Clone and install dependencies
- `git clone <repository-url>`
- `npm install`
- Start the development server
- `npm run dev`
