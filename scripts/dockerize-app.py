import os, argparse, logging, sys, subprocess, re

DOCKERFILES_CONFIG = {
    "blog": {
        "path": "./blog",
        "dockerfile": "blog/Dockerfile",
        "versionFile": "blog/package.json",
        "versionName": "\"version\":",
        "regexMatch": r'(\d+\.\d+\.\d+)',
        "extraDockerArgs": ["--build-arg", "VITE_API_URL=https://api.jdonohoe.net"]
    },
    "backend": {
        "path": "./infrastructure/backend",
        "dockerfile": "infrastructure/backend/Dockerfile",
        "versionFile": "infrastructure/backend/version.go",
        "versionName": "Version = ",
        "regexMatch": r'(\d+\.\d+\.\d+)',
        "extraDockerArgs": []
    },
    "nginx": {
        "path": "./infrastructure/nginx",
        "dockerfile": "infrastructure/nginx/Dockerfile",
        "versionFile": "infrastructure/nginx/build.version",
        "versionName": "version = ",
        "regexMatch": r'(\d+\.\d+\.\d+)',
        "extraDockerArgs": []
    }
}

DIGITAL_OCEAN_API_KEY = os.getenv ("DO_API_TOKEN")
DIGITAL_OCEAN_REGISTRY_URL = os.getenv ("DO_REGISTRY")

if not DIGITAL_OCEAN_API_KEY or not DIGITAL_OCEAN_REGISTRY_URL:
    logging.error ("digital ocean environment setting missing, make sure to "
                   "run the tokens file")
    sys.exit (1)

class Dockerize:
    def __init__ (self,
                  app_name: str,
                  app_config: dict[str, str],
                  dry_run: bool,
                  push: bool=False):
        self.push = push
        self.app_name = app_name
        self.app_config = app_config
        self.dry_run = dry_run
        self.version = None
        self.registry_url = DIGITAL_OCEAN_REGISTRY_URL
        self.registry_key = DIGITAL_OCEAN_API_KEY

    def run_command (self, cmd, **kwargs):
        logging.info (f"running the command: {' '.join (cmd)}")
        if self.dry_run:
            logging.info (f"dry run enabled - command not executed")
            return 0
        process = subprocess.run (cmd, **kwargs)
        if process.returncode != 0:
            logging.error (f"command failed with exit code {process.returncode}")
        return process.returncode

    def docker_login (self):
        cmd = ["docker",
               "login",
               "registry.digitalocean.com",
               "-u",
               "doctl",
               "-p",
               self.registry_key]
        return self.run_command (cmd)
    

    def create_image (self):
        if not self.version:
            logging.error ("version is not set; cannont build image")
            return

        logging.info (f"building docker image for {self.app_name}")
        tag_latest = f"{self.registry_url}/blog:{self.app_name}-latest"
        tag_version = f"{self.registry_url}/blog:{self.app_name}-{self.version}"
        
        docker_command = ["docker", "build",
                          "-t",
                          tag_latest,
                          "-t",
                          tag_version,
                          "-f",
                          self.app_config["dockerfile"],
                          "--no-cache"]
        
        # Add extra docker args from config
        extra_args = self.app_config.get("extraDockerArgs", [])
        if extra_args:
            docker_command.extend(extra_args)
        
        docker_command.append(self.app_config["path"])
        context_path = self.app_config.get ("context_path", ".")
        return self.run_command (docker_command, cwd=context_path)

    def get_version_number (self):
        logging.info (f"fetching version number for {self.app_name}")
        version_name = self.app_config.get ("versionName", "")
        version_file = self.app_config.get ("versionFile", "")
        regex_match = self.app_config.get ("regexMatch", "")
        if not version_name:
            logging.error ("no version name specified in app_config")
            return
        if not version_file:
            logging.error ("no version file specified in app_config")
            return

        with open (version_file, 'r') as f:
            for line in f:
                line = line.strip ()
                if line.startswith (version_name):
                    version = line[len (self.app_config["versionName"]):].strip ()
                    if regex_match:
                        match = re.search (regex_match, version)
                        if match:
                            version = match.group(1)

                    self.version = version
                    break

        logging.info (f"version for {self.app_name} is {self.version}")

    def docker_push (self):
        tag_version = f"{self.registry_url}/blog:{self.app_name}-{self.version}"
        tag_latest = f"{self.registry_url}/blog:{self.app_name}-latest"
        for tag in [tag_version, tag_latest]:
            cmd = ["docker", "push", tag]
            self.run_command (cmd)

    def start (self):
        self.docker_login ()
        self.get_version_number ()
        if self.version != None:
            self.create_image ()
            if self.push:
                self.docker_push ()

if __name__ == "__main__":
    logging.basicConfig (
        level=logging.INFO
    )
    available_apps = list (DOCKERFILES_CONFIG.keys ())
    parser = argparse.ArgumentParser (description="Build Docker images")
    parser.add_argument ("--push",
                         action="store_true",
                         help="push the image to the digital ocean registory")
    parser.add_argument ("apps",
                         metavar="APP",
                         nargs="+",
                         choices=available_apps,
                         help=("select apps to dockerize, "
                               f"available options {available_apps}"))
    parser.add_argument ("--dry-run",
                         action="store_true",
                         help="block executable commands from running")

    args = parser.parse_args ()

    for app in args.apps:
        dockerize = Dockerize (app_name=app,
                               app_config=DOCKERFILES_CONFIG[app],
                               dry_run=args.dry_run,
                               push=args.push)

        dockerize.start ()
