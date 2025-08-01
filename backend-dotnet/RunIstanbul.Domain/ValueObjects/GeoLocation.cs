using NetTopologySuite.Geometries;

namespace RunIstanbul.Domain.ValueObjects;

// Location value object with modern C# features
public readonly record struct GeoLocation(double Latitude, double Longitude)
{
    public Point ToPoint() => new(Longitude, Latitude) { SRID = 4326 };
    
    public static implicit operator Point(GeoLocation location) => location.ToPoint();
    
    public double DistanceTo(GeoLocation other)
    {
        // Haversine formula implementation
        const double R = 6371; // Earth's radius in km
        var lat1Rad = Latitude * Math.PI / 180;
        var lat2Rad = other.Latitude * Math.PI / 180;
        var deltaLatRad = (other.Latitude - Latitude) * Math.PI / 180;
        var deltaLngRad = (other.Longitude - Longitude) * Math.PI / 180;

        var a = Math.Sin(deltaLatRad / 2) * Math.Sin(deltaLatRad / 2) +
                Math.Cos(lat1Rad) * Math.Cos(lat2Rad) *
                Math.Sin(deltaLngRad / 2) * Math.Sin(deltaLngRad / 2);
        
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c * 1000; // Return in meters
    }
}