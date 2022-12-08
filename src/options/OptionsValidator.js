const ALLOWED_DATA_TYPES = ['json', 'csv', 'tsv', 'txt'];

/**
 * Ensure that critical options are valid
 *
 * @throw {Error} on critical invalid options
 * @return {boolean} Returns true when there is not critical errors
 */
export default function validate(
  subDomainTemplate,
  { domain, subDomain, dataType },
) {
  const domainType = domain.type;
  const subDomainType = subDomain.type;

  if (!subDomainTemplate.has(domainType)) {
    throw new Error(`'${domainType}' is not a valid domain type'`);
  }

  if (!subDomainTemplate.has(subDomainType)) {
    throw new Error(`'${subDomainType}' is not a valid domain type'`);
  }

  if (
    subDomainTemplate.at(domainType).level <=
    subDomainTemplate.at(subDomainType).level
  ) {
    throw new Error(
      `'${subDomainType}' is not a valid subDomain to '${domainType}'`,
    );
  }

  if (dataType && !ALLOWED_DATA_TYPES.includes(dataType)) {
    throw new Error(`The data type '${dataType}' is not valid data type`);
  }

  return true;
}
