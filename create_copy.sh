#!/bin/bash

initial=$1

if [ "${initial}" == "" ]; then
    echo "Usage: create_copy.sh <candidate-initials>"
    exit
fi

set -euo pipefail
shopt -s extglob dotglob

basedir="$(dirname "${0}")"
pushd "${basedir}" >/dev/null || exit
taskname=$(basename "${PWD}")

task_dirname="${taskname}-${initial}"

new_taskdir="../${task_dirname}"

if [ -x "${new_taskdir}" ]; then
    echo "Directory for ${task_dirname} already exists. Remove this before continuing."
    exit
fi

repo_stub="excession-careers/candidate-tests/frontend-developer"
repo="${repo_stub}/${task_dirname}"
origin="git@gitlab.com:${repo}"

echo "About to create a copy of this template under as ${task_dirname}"
echo -e "\nPlease ensure that this repo exists and is blank at https://gitlab.com/${repo_stub}\n"
echo "Once the repo is created, press enter to continue"

get_enter_key() {
    read -rn 1 key
    if [ "${key}" != "" ]; then
        get_enter_key
    fi
}

get_enter_key

echo -e "\nCreating directory and copying contents"

mkdir "${new_taskdir}"
cp -a !(node_modules|create_copy.sh|client|server) "${new_taskdir}"

mkdir "${new_taskdir}/client"
cp -a client/!(node_modules) "${new_taskdir}/client"

mkdir "${new_taskdir}/server"
cp -a server/!(node_modules) "${new_taskdir}/server"

echo -e "\nChanging origin to ${origin}"
pushd "${new_taskdir}" || exit
git remote set-url origin "${origin}"

echo -e '\nMerging changes into initial commit'
git add --all
git commit --amend --no-edit

echo -e "\nCommitting template to repo"
git push

echo -e "\nPush complete"
