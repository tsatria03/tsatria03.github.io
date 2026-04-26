import subprocess
import os
import sys


REPO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def run(args, capture=False):
    result = subprocess.run(args, cwd=REPO_DIR, capture_output=capture, text=True)
    return result

def run_out(args):
    return run(args, capture=True).stdout.strip()

def ask(prompt):
    return input(f"{prompt} (Y/N): ").strip().upper() == "Y"

def clip(text):
    subprocess.run("clip", input=text.strip(), text=True)

def unpushed_count():
    out = run_out(["git", "log", "origin/HEAD..HEAD", "--oneline"])
    return len([l for l in out.splitlines() if l.strip()])

def menu():
    while True:
        unpushed = unpushed_count()
        print()
        print("========================")
        print("  CST Committer")
        print("========================")
        print(" 1. Make a commit")
        print(" 2. Undo last commit (unpushed)")
        print(" 3. Show commit history")
        print(" 4. Exit")
        print("========================")
        choice = input("Choose an option: ").strip()
        print()
        if choice == "1":
            do_commit()
        elif choice == "2":
            do_undo(unpushed)
        elif choice == "3":
            do_history()
        elif choice == "4":
            sys.exit(0)
        else:
            print("Invalid choice. Please enter 1, 2, 3, or 4.")

def do_undo(unpushed):
    if unpushed == 0:
        print("Nothing to undo. All commits have been pushed.")
        return
    last_msg = run_out(["git", "log", "-1", "--format=%s"])
    print(f"Last commit: {last_msg}")
    print()
    if not ask("Undo this commit? Your changes will remain staged."):
        print("Cancelled.")
        return
    result = run(["git", "reset", "--soft", "HEAD~1"])
    if result.returncode != 0:
        print("ERROR: Undo failed.")
    else:
        print("Commit undone. Your changes are still staged.")

def do_commit():
    status = run_out(["git", "status", "--short"])
    changes = len([l for l in status.splitlines() if l.strip()])
    print(f"Changes: {changes}")
    print()
    if changes == 0:
        print("No changes to commit.")
        return
    print(status)
    print()
    if not ask("Do you want to commit?"):
        print("Cancelled.")
        return
    print()
    summary = input("Commit summary: ").strip()
    if not summary:
        print("Summary cannot be empty.")
        return
    print()
    description = input("Commit description (optional, press Enter to skip): ").strip()
    print()
    print(f"Summary:     {summary}")
    if description:
        print(f"Description: {description}")
    print()
    if not ask("Is this correct?"):
        print("Cancelled.")
        return
    print()
    run(["git", "add", "-A"])
    args = ["git", "commit", "-m", summary]
    if description:
        args += ["-m", description]
    result = run(args)
    if result.returncode != 0:
        print("ERROR: Commit failed.")
        return
    print()
    print(f"Committed {changes} file(s).")
    print()
    if not ask("Do you want to push?"):
        print("Changes committed but not pushed.")
        return
    print()
    result = run(["git", "push"])
    if result.returncode != 0:
        print("ERROR: Push failed.")
    else:
        print("Push complete.")

def do_history():
    raw = run_out(["git", "log", "-50", "--decorate-refs=refs/tags", "--format=%h~%ar~%s%d"])
    commits = []
    print()
    print("Last 50 commits:")
    print()
    for i, line in enumerate(raw.splitlines(), 1):
        parts = line.split("~", 2)
        if len(parts) < 3:
            continue
        sha, date, msg = parts
        commits.append((sha, msg))
        print(f"  {i}. {sha}  {msg}  (Time: {date})")
    print()
    pick = input("Select a commit number (or 0 to go back): ").strip()
    if pick == "0" or pick == "":
        return
    try:
        index = int(pick) - 1
        if index < 0 or index >= len(commits):
            raise ValueError
    except ValueError:
        print("Invalid selection.")
        return
    sha, msg = commits[index]
    print()
    print(f"Selected: {sha} {msg}")
    commit_menu(sha, msg)

def commit_menu(sha, msg):
    while True:
        print()
        print("========================")
        print(" Commit Options")
        print("========================")
        print(" 1. Show description")
        print(" 2. Copy SHA")
        print(" 3. Create tag")
        print(" 4. Copy tag")
        print(" 5. Reset to this commit")
        print(" 6. Go back")
        print("========================")
        choice = input("Choose an option: ").strip()
        print()
        if choice == "1":
            show_desc(sha)
        elif choice == "2":
            copy_sha(sha)
        elif choice == "3":
            create_tag(sha)
        elif choice == "4":
            copy_tag(sha)
        elif choice == "5":
            if do_reset(sha):
                return
        elif choice == "6":
            do_history()
            return
        else:
            print("Invalid choice.")

def show_desc(sha):
    desc = run_out(["git", "log", "-1", "--format=%B", sha])
    print(desc if desc else "(No description)")
    print()

def copy_sha(sha):
    full = run_out(["git", "rev-parse", sha])
    clip(full)
    print(f"SHA copied to clipboard: {full}")

def create_tag(sha):
    tag_name = input("Enter tag name: ").strip()
    if not tag_name:
        print("Tag name cannot be empty.")
        return
    result = run(["git", "tag", tag_name, sha])
    if result.returncode != 0:
        print("ERROR: Failed to create tag.")
        return
    print(f'Tag "{tag_name}" created.')
    if ask("Push tag to remote?"):
        run(["git", "push", "origin", tag_name])
        print("Tag pushed.")

def copy_tag(sha):
    tag = run_out(["git", "tag", "--points-at", sha])
    if not tag:
        print("No tag found on this commit.")
    else:
        clip(tag)
        print(f"Tag copied to clipboard: {tag}")

def do_reset(sha):
    print("WARNING: Resetting will move HEAD to this commit.")
    print()
    print(" 1. Soft (keeps changes staged)")
    print(" 2. Hard (discards all changes permanently)")
    print(" 3. Cancel")
    print()
    choice = input("Choose reset type: ").strip()
    if choice == "3" or choice == "":
        print("Cancelled.")
        return False
    if choice == "1":
        flag = "--soft"
    elif choice == "2":
        flag = "--hard"
        print()
        print("WARNING: Hard reset will permanently discard all uncommitted changes.")
    else:
        print("Invalid choice.")
        return False
    print()
    if not ask(f"Reset to {sha}?"):
        print("Cancelled.")
        return False
    result = run(["git", "reset", flag, sha])
    if result.returncode != 0:
        print("ERROR: Reset failed.")
        return False
    print("Reset complete.")
    return True

if __name__ == "__main__":
    menu()
