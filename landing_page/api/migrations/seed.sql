CREATE TABLE IF NOT EXISTS waitlist (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email_address TEXT NOT NULL UNIQUE,
	created_at integer(4) not null default (strftime('%s','now')),
	updated_at integer(4) NULL,
	deleted_at integer(4) NULL
);

CREATE TRIGGER IF NOT EXISTS update_waitlist_updated_at
	AFTER UPDATE ON waitlist
	FOR EACH ROW
	BEGIN
    UPDATE waitlist SET updated_at = strftime('%s','now') WHERE id = OLD.id;
	END;

--needed because of https://github.com/cloudflare/workers-sdk/pull/2912
select count(*) from waitlist;