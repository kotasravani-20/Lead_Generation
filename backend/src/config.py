"""
Centralized configuration, scoring weights, and keyword dictionaries for LeadLens Backend.
"""

DEFAULT_WEIGHTS = {
    "company_fit": 25,
    "growth_signal": 20,
    "funding_signal": 15,
    "revenue_size_fit": 15,
    "decision_maker": 10,
    "technology_relevance": 10,
    "data_quality": 5,
}

PRIORITY_THRESHOLDS = [
    (80, "High Priority"),
    (60, "Good Opportunity"),
    (40, "Review"),
    (0, "Low Priority"),
]

ACTION_POLICY = {
    "High Priority": "Contact first",
    "Good Opportunity": "Review and contact",
    "Review": "Research further",
    "Low Priority": "Deprioritize",
}

REQUIRED_COLUMNS = [
    "company_name",
    "industry",
    "location",
    "employee_count",
    "estimated_revenue",
    "decision_maker_title",
    "company_description",
]

OPTIONAL_COLUMNS = [
    "website",
    "funding_stage",
    "funding_amount",
    "technology_stack",
    "growth_signal",
    "email",
    "linkedin_url",
    "decision_maker_name",
]

DECISION_MAKER_TITLES = [
    "founder",
    "co-founder",
    "ceo",
    "chief executive officer",
    "owner",
    "president",
    "vp",
    "vice president",
    "head",
    "director",
    "chief",
    "cto",
    "cmo",
    "cro",
    "cfo",
    "coo",
    "managing director",
    "partner",
]

GROWTH_KEYWORDS = [
    "hiring",
    "hired",
    "expanding",
    "expansion",
    "growth",
    "growing",
    "new market",
    "market expansion",
    "launch",
    "launching",
    "scaling",
    "headcount growth",
    "opening new",
    "doubling team",
    "fast-growing",
    "rapid growth",
    "momentum",
]

FUNDING_KEYWORDS = [
    "funded",
    "funding",
    "investment",
    "series a",
    "series b",
    "series c",
    "series d",
    "seed",
    "venture",
    "raised",
    "capital",
    "investor",
    "backed",
    "pre-seed",
    "growth round",
    "valuation",
]

TARGET_TECHNOLOGIES = [
    "aws",
    "azure",
    "gcp",
    "python",
    "react",
    "node",
    "salesforce",
    "hubspot",
    "snowflake",
    "databricks",
    "kubernetes",
    "docker",
    "stripe",
    "segment",
    "openai",
    "ai",
    "machine learning",
    "llm",
    "automation",
    "analytics",
    "cloud",
]

TARGET_ICP = {
    "preferred_industries": [
        "SaaS",
        "Software",
        "FinTech",
        "CyberSecurity",
        "Cloud Computing",
        "Artificial Intelligence",
        "E-Commerce",
        "MarketingTech",
        "HealthTech",
        "Data Analytics",
    ],
    "target_employee_min": 15,
    "target_employee_max": 2500,
    "target_revenue_min": 1_000_000,
    "target_revenue_max": 500_000_000,
}
