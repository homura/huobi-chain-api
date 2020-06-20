#!/usr/bin/env node
require('@muta-extra/common').loadEnvFile();

import { createRunnableMigrate } from '@muta-extra/knex-mysql/lib/migration/run';
import { HuobiMigration001 } from '../db-mysql/migration/001';

createRunnableMigrate(new HuobiMigration001());
