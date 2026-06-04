.DEFAULT_GOAL := help

ZIP_FILE := telemost-hotkeys-chrome.zip
EXTENSION_DIR := chrome-extension

help:
	@cat Makefile

zip:
	@rm -f $(ZIP_FILE)
	@cd $(EXTENSION_DIR) && zip -r ../$(ZIP_FILE) . -x "telemost-hotkeys-icons.zip"
