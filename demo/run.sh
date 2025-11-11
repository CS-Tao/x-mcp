#!/usr/bin/env bash

if [ -r "$HOME/.zshrc" ]; then
  source "$HOME/.zshrc"
elif [ -r "$HOME/.bashrc" ]; then
  source "$HOME/.bashrc"
fi

NPM_CONFIG_LOGLEVEL=silent npm run demo
