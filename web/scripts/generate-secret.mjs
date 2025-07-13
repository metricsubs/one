import crypto from 'crypto';

// optional argument to specify the length of the secret

const args = process.argv.slice(2);
const length = args.length > 0 ? parseInt(args[0]) : 32;

const generateSecret = (length = 32) => {
    return crypto
        .randomBytes(1 + length / 2)
        .toString('hex')
        .slice(0, length);
};

if (isNaN(length)) {
    throw new Error('Length must be a number');
}

if (length < 1) {
    throw new Error('Length must be greater than 0');
}

const secret = generateSecret(length);

if (secret.length !== length) {
    throw new Error('Generated secret is not the correct length');
}

process.stdout.write(secret);
process.stdout.write('\n');
