interface Dimension {
	Name: string;
	Value: string;
	IsDisplay: boolean;
	DisplayOrder: number;
}

interface Housing {
	CSDUID: string;
	CSD: string;
	Period: string;
	IndicatorSummaryDescription: string;
	Dimensions: Dimension[];
	UnitOfMeasure: string;
	OriginalValue: number;
}
