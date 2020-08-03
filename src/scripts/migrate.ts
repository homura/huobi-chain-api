#!/usr/bin/env node
require('@muta-extra/common').loadEnvFile();

import { createMigration } from '@muta-extra/hermit-purple';
import { HuobiMigration001 } from '../db-mysql/migration/001';

const migration = new HuobiMigration001();
createMigration(migration);
